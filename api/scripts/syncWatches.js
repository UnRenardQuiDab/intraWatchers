#!/usr/bin/env node
/*
  syncWathes.js
  Usage:
	# show diffs between app.nb_watch and intra transactions count
	node scripts/syncWathes.js

	# apply fixes (set user.nb_watch to fetched count) - prompts for confirmation
	node scripts/syncWathes.js --apply

  Notes:
	- Requires the same environment as the API: MONGO_URI, INTRA_API credentials used by api42
	- Reuses `api/api42.js` and `api/models/Users.js`
*/
process.env.MONGO_URI = "mongodb://localhost:27018/watchers"

require("dotenv").config({ path: `../.env` });
const mongoose = require('../db');
const api42 = require('../api42');
const Users = require('../models/Users');
const readline = require('readline');

function parseArgs() {
	const argv = process.argv.slice(2);
	const result = {};
	argv.forEach(arg => {
		if (arg.startsWith('--')) {
			const [k, v] = arg.slice(2).split('=');
			result[k] = v === undefined ? true : v;
		}
	});
	return result;
}

function question(message) {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	return new Promise(resolve => rl.question(message, ans => { rl.close(); resolve(ans); }));
}

async function run({ apply }) {
	if (mongoose.connection.readyState !== 1) {
		console.log('Waiting for DB connection...');
		await new Promise((resolve, reject) => {
			mongoose.connection.once('open', resolve);
			mongoose.connection.on('error', reject);
		});
	}

	console.log(' ---');

	const diffs = [];
	try {
		const users = await Users.find({});
		for (const user of users) {
			try {
				console.log(user.login);
				const watches = await api42.fetch(`/v2/users/${user.login}/transactions?filter[reason]=Surveillance d'Exam`, { pageSize: 100 });
				const count = watches.length;
				if (user.nb_watch !== count) {
					diffs.push({ login: user.login, intra: count, app: user.nb_watch, diff: user.nb_watch - count });
				}
			} catch (err) {
				console.error(`Error fetching transactions for ${user.login}:`, err.message || err);
			}
		}

		console.log(' ---\nDiffs:');
		console.dir(diffs, { depth: 2 });

		if (apply) {
			if (diffs.length === 0) {
				console.log('No diffs to apply');
				return;
			}
			for (const d of diffs) {
				try {
					const ans = await question(`Apply database update for ${d.login}? app=${d.app} -> intra=${d.intra} (y/N) `);
					if (!/^y(es)?$/i.test(ans)) {
						console.log(`Skipped ${d.login}`);
						continue;
					}
					const u = await Users.findOne({ login: d.login });
					if (!u) {
						console.log(`User ${d.login} not found, skipping`);
						continue;
					}
					u.nb_watch = d.intra;
					await u.save();
					console.log(`Updated ${d.login} -> nb_watch=${d.intra}`);
				} catch (err) {
					console.error('Error updating user', d.login, err.message || err);
				}
			}
		}
	} catch (err) {
		console.error('Sync failed:', err);
	}
}


async function main() {
	try {
		const args = parseArgs();
		await run({ apply: !!args.apply });
	} catch (err) {
		console.error(err);
	} finally {
		try { await mongoose.disconnect(); } catch (_) { }
	}
}

if (require.main === module) main();

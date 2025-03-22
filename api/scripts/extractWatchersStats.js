const { default: mongoose } = require("mongoose");
const api42 = require("../api42");
const Users = require("../models/Users");

const spreadsheetIds = ["1fL69sCe8gwaDTcMw1TS5MAGmFiFb8w31qE2cn1Z8UBk", "1SbYQ5tCjiJtsNk4TpeIncDT6p1w0gajS2Fy0Oo0GhVY"]

async function getUser(login) {
	login = login.toLowerCase();
	const user = await Users.findOne({ login });
	if (user) {
		return user;
	}
	try {
		const intraUser = await api42.getUser(login);
		if (!intraUser) {
			return null;
		}
		const groups = await api42.fetch(`/v2/users/${intraUser.login}/groups`);
		const user = new Users({
			login: intraUser.login,
			firstname: intraUser.first_name,
			lastname: intraUser.last_name,
			image_url: intraUser.image.link,
			groups: groups.map(group => group.name)
		});
		await user.save();
		return user;
	}
	catch(e) {
		return null;
	}
}


async function extractWatchersStats() {
	
	for (const spreadsheetId of spreadsheetIds) {
		const RANGE = "Datas!E2:F";
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${RANGE}?key=${process.env.GOOGLE_API_KEY}`;
		const res = await fetch(url);
		const data = await res.json();
		for (const user of data.values) {
			const login = user[0].toLowerCase();
			const nb_watch = parseInt(user[1]);
			const dbUser = await getUser(login);
			if (dbUser && dbUser.nb_watch < nb_watch) {
				dbUser.nb_watch = nb_watch;
				await dbUser.save();
				console.log(`Updated ${login} with ${nb_watch} watches`);
			}
			//console.log(`User ${login} not found`);
		};
	}
	mongoose.connection.close()
}

extractWatchersStats()
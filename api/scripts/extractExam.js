const { default: mongoose } = require("mongoose");
const api42 = require("../api42");
const Exams = require("../models/Exams");
const Users = require("../models/Users");
const sheetNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// 2024
// const spreadsheetId = "1fL69sCe8gwaDTcMw1TS5MAGmFiFb8w31qE2cn1Z8UBk"
// const year = 2024

// 2025
const spreadsheetId = "1SbYQ5tCjiJtsNk4TpeIncDT6p1w0gajS2Fy0Oo0GhVY"
const year = 2025

async function createUser(login) {
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

async function createExam(date, day, watcher1, watcher2) {
	const watchers = []
	if (watcher1) {
		const user = await createUser(watcher1);
		if (user)
			watchers.push(user);
	}
	if (watcher2) {
		const user = await createUser(watcher2);
		if (user)
			watchers.push(user);
	}
	const start_at = new Date(year, date.split('/')[1]-1, date.split('/')[0], day === 'MARDI' ? 10 : 14)
	const examExists = await Exams.findOne({ start_at });
	if (examExists)
		return;

	const is_archived = new Date(start_at.getTime() + 3 * 60 * 60 * 1000) < new Date();
	console.log(start_at, is_archived);
	const exam = new Exams({
		start_at,
		watchers,
		is_archived,
		authorized_groups: ["Watcher", "Tutor"],
		nb_slots: 2,
		duration: 3,
	});
	if (day === 'VENDREDI')
		exam.title = "Alone in the Dark";
	await exam.save();
}

async function extractExams() {
	
	for (const sheetName of sheetNames) {
		const RANGE = sheetName+"!C3:K";
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${RANGE}?key=${process.env.GOOGLE_API_KEY}`;
		const res = await fetch(url);
		const data = await res.json();
		for (let i = 0; i < data.values[0].length; i++) {
			await createExam(data.values[0][i], data.values[1][i], data.values[2][i], data.values[3][i]);
		}
	}
	mongoose.connection.close()
}

extractExams()
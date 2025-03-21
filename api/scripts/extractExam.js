const sheetNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// 2024
// const spreadsheetId = "1fL69sCe8gwaDTcMw1TS5MAGmFiFb8w31qE2cn1Z8UBk"
// const year = 2024

// 2025
const spreadsheetId = "1SbYQ5tCjiJtsNk4TpeIncDT6p1w0gajS2Fy0Oo0GhVY"
const year = 2025

const sessionCookie = 'IntraWatcher.sid=s%3AexYJlcDrPqZElJoiLOrOLYeanBUoI3_R.qD1A2y2bsuPXFCDLfTAi%2FM%2Fzmus9iTlLVEYoyjy%2FbG8'

async function postExam(exam) {
	console.log('post exam', exam.start_at);
	const res = await fetch('https://tutors.bastienw.fr/api/exams', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cookie': sessionCookie
		},
		body: JSON.stringify(exam),
	});
	const data = await res.json();
	return data;
}

async function postUser(login) {
	const res = await fetch('https://tutors.bastienw.fr/api/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cookie': sessionCookie
		},
		body: JSON.stringify({ login }),
	});
	if (res.ok) {
		const data = await res.json();
		return data;
	}
}

async function fetchExams() {
	const res = await fetch('https://tutors.bastienw.fr/api/exams', {
		headers: {
			'Cookie': sessionCookie
		},
	});
	const data = await res.json();
	console.log('fetched', data.length, 'exams');
	return data;
}

async function postWatcher(examId, login) {
	console.log('register watcher', login, 'for exam', examId);
	const res = await fetch(`https://tutors.bastienw.fr/api/exams/${examId}/watchers`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cookie': sessionCookie
		},
		body: JSON.stringify({ login }),
	});
}

async function postArchivedExam(examId) {
	console.log('archiving exam', examId);
	const res = await fetch(`https://tutors.bastienw.fr/api/exams/${examId}/archive`, {
		method: 'POST',
		headers: {
			'Cookie': sessionCookie
		},
	});
}

async function createExam(date, day, watcher1, watcher2) {
	const watchers = []
	if (watcher1) {
		const user = await postUser(watcher1);
		if (user)
			watchers.push(user);
	}
	if (watcher2) {
		const user = await postUser(watcher2);
		if (user)
			watchers.push(user);
	}
	const start_at = new Date(year, date.split('/')[1]-1, date.split('/')[0], day === 'MARDI' ? 10 : 14)
	const exams = await fetchExams();
	const examExists = exams.find(exam => new Date(exam.start_at).getTime() === start_at.getTime());
	if (examExists)
		return;

	const is_archived = new Date(start_at.getTime() + 3 * 60 * 60 * 1000) < new Date();
	const exam = await postExam({
		start_at,
		authorized_groups: ["Watcher", "Tutor"],
		nb_slots: 2,
		duration: 3,
		title: day === 'VENDREDI' ? "Alone in the Dark" : "",
	});

	console.log('watchers', watchers);
	for (const watcher of watchers) {
		await postWatcher(exam._id, watcher.login);
	}

	if (is_archived) {
		await postArchivedExam(exam._id);
	}

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
}

extractExams()
const sheetNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const datas = [
	{
		year: 2024,
		spreadsheetId: "1fL69sCe8gwaDTcMw1TS5MAGmFiFb8w31qE2cn1Z8UBk",
	},
	{
		year: 2025,
		spreadsheetId: "1SbYQ5tCjiJtsNk4TpeIncDT6p1w0gajS2Fy0Oo0GhVY",
	}
]

const sessionCookie = `IntraWatcher.sid=${process.env.INTRA_WATCHER_SESSION}`;
const apiUrl = 'https://tutors.bastienw.fr/api';

async function postExam(exam) {
	console.log('post exam', exam.start_at);
	const res = await fetch(`${apiUrl}/exams`, {
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

	const res = await fetch(`${apiUrl}/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cookie': sessionCookie
		},
		body: JSON.stringify({ login: login.toLowerCase() }),
	});
	if (res.ok) {
		const data = await res.json();
		return data;
	}
	console.error('fail create user', login, res.statusText);
	return null;
}

async function getUser(login) {
	const res = await fetch(`${apiUrl}/users?page=1&pageSize=100&login=${login}`, {
		headers: {
			'Cookie': sessionCookie
		},
	});
	const data = await res.json();
	if (res.ok && data.length) 
		return data[0];
	const user = await postUser(login);
	return user;
}

async function fetchExams() {
	const res = await fetch(`${apiUrl}/exams`, {
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
	const res = await fetch(`${apiUrl}/exams/${examId}/watchers`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cookie': sessionCookie
		},
		body: JSON.stringify({ login }),
	});
}

async function postArchivedExam(examId) {
	const res = await fetch(`${apiUrl}/exams/${examId}/archived`, {
		method: 'POST',
		headers: {
			'Cookie': sessionCookie
		},
	});
	if (res.ok) {
		console.log('archived exam', examId);
	}
	else {
		console.error(res.status, await res.text());
	}
}

let total = 0;

async function createExam(date, day, watcher1, watcher2, year) {
	total++;
	console.log('create exam', date, day, watcher1, watcher2);
	const watchers = []
	if (watcher1) {
		const user = await getUser(watcher1);
		if (user)
			watchers.push(user);
	}
	if (watcher2) {
		const user = await getUser(watcher2);
		if (user)
			watchers.push(user);
	}
	console.log('watchers', watchers.map(w => w.login));
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

	for (const watcher of watchers) {
		await postWatcher(exam._id, watcher.login);
	}

	if (is_archived) {
		await postArchivedExam(exam._id);
	}
	
	console.log('\n\n');
}

async function extractExams() {
	
	for (const sheet of datas) {
		const year = sheet.year;
		const spreadsheetId = sheet.spreadsheetId;
		for (const sheetName of sheetNames) {
			const RANGE = sheetName+"!C3:K";
			const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${RANGE}?key=${process.env.GOOGLE_API_KEY}`;
			const res = await fetch(url);
			const data = await res.json();
			for (let i = 0; i < data.values[0].length; i++) {
				await createExam(data.values[0][i], data.values[1][i], data.values[2][i], data.values[3][i], year);
			}
		}
	}
}

extractExams()
	.then(() => console.log('done', total))
	.catch(console.error);

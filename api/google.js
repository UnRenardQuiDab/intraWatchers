const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function insertRow(login, date) {
	const readResponse = await sheets.spreadsheets.values.get({
		spreadsheetId: process.env.SPREADSHEET_ID,
		range: 'Tutors/Watchers/Ambassadors!B:B',
	});

	const firstEmptyRow = (readResponse.data.values || []).length + 1;

	await sheets.spreadsheets.values.update({
		spreadsheetId: process.env.SPREADSHEET_ID,
		range: `Tutors/Watchers/Ambassadors!B${firstEmptyRow}`,
		valueInputOption: 'USER_ENTERED',
		resource: {
			values: [["Surveillance d'Exam", login]],
		},
	});
	await sheets.spreadsheets.values.update({
		spreadsheetId: process.env.SPREADSHEET_ID,
		range: `Tutors/Watchers/Ambassadors!E${firstEmptyRow}`,
		valueInputOption: 'USER_ENTERED',
		resource: {
			values: [[new Date(date).toLocaleDateString('fr-FR')]],
		},
	});
}

module.exports = insertRow;
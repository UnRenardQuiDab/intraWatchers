const { google } = require('googleapis');
const fs = require('fs');

// Charger les credentials du service account
const credentials = JSON.parse(fs.readFileSync('./intrawatcher-credentials.json'));

// Configurer l'authentification
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Autorisation pour modifier la Google Sheet
});

const sheets = google.sheets({ version: 'v4', auth });

// ID de la Google Sheet (extrait de l'URL de la feuille)
const spreadsheetId = '1t57dZ8FaVhKGt8ouUWRI3l6YmfOzeFwMQst-udfnTM4';

// Données à écrire
const word = ['Surveillance d\'Exam', 'bwisniew', null, '22/12/2021'];

async function insertRow() {
	const protectedColumnIndex = 4; // Index de la colonne protégée (0 pour A, 1 pour B, etc.)
  
	try {
	  // Lire les données existantes pour déterminer la première ligne vide
	  const readResponse = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: 'Tutors/Watchers/Ambassadors!B:B', // Lecture de la première colonne pour détecter la fin des données
	  });
  
	  const values = readResponse.data.values || [];
	  const firstEmptyRow = values.length + 1; // Ligne après la dernière occupée
  
	  // Préparer les données avec une valeur vide pour la cellule protégée
	  const filteredRowData = word.map((value, index) => 
		index === protectedColumnIndex ? '' : value
	  );
  
	  // Insérer les valeurs dans cette ligne
	  const writeResponse = await sheets.spreadsheets.values.update({
		spreadsheetId,
		range: `Tutors/Watchers/Ambassadors!B${firstEmptyRow}`, // Insérer les données sur cette ligne
		valueInputOption: 'USER_ENTERED', // Respecter les règles de validation
		resource: {
		  values: [filteredRowData], // Ajouter les données avec la cellule protégée ignorée
		},
	  });
  
	  console.log(`Les données ont été insérées sur la ligne ${firstEmptyRow}, en sautant la cellule protégée.`);
	} catch (err) {
	  console.error('Erreur :', err.message);
	}
  }
  
  insertRow();
const env = {
	CAMPUS_ID: Number(process.env.CAMPUS_ID),
	NEWBIE_COUNT: Number(process.env.NEWBIE_COUNT) || 1,
	LIFEGUARD_LOGINS: (process.env.LIFEGUARD_LOGINS || '')
		.split(',')
		.map(login => login.trim().toLowerCase())
		.filter(Boolean)
};

if (isNaN(env.CAMPUS_ID)) {
	throw Error("CAMPUS_ID environment variable must be set to a valid number")
}

module.exports = env;

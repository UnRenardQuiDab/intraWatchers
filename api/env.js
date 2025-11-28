const env = {
	CAMPUS_ID: Number(process.env.CAMPUS_ID)
};

if (isNaN(env.CAMPUS_ID)) {
	throw Error("CAMPUS_ID environment variable must be set to a valid number")
}

module.exports = env;

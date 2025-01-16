const { default: mongoose } = require("mongoose");
const Exams = require("../models/Exams");
const Users = require("../models/Users");

async function updateLastWatch() {
	const users = await Users.find();
	for (const user of users) {
		const exams = await Exams.find({
			watchers: user._id,
			is_archived: true,
		}).sort({ start_at: -1 });
		if (exams.length > 0) {
			user.last_watch = exams[0].start_at;
			await user.save();
		}
	}
	mongoose.connection.close();
}

updateLastWatch();
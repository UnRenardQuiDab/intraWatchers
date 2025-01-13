const mongoose = require('../db');

const usersSchema = new mongoose.Schema({
	login: { type: String, required: true, unique: true },
	firstname: { type: String , required: true },
	lastname: { type: String, required: true },
	image_url: { type: String, required: true },
	is_staff: { type: Boolean, default: false },
	nb_watch: { type: Number, default: 0 },
	last_watch: { type: Date, default: null },
	groups: [{ type: String }]
});

usersSchema.index({ login: 'text', firstname: 'text' });


const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
const mongoose = require('../db');

const examsSchema = new mongoose.Schema({
	title: {type: String},
	start_at: { type: Date, required: true },
	duration: { type: Number, required: true },
	authorized_groups: [{ type: String, required: true }],
	nb_slots: { type: Number, required: true },
	watchers: {type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], default: []}
});

const Exams = mongoose.model('Exams', examsSchema);

module.exports = Exams;
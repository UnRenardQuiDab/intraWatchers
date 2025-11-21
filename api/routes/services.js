const Exams = require("../models/Exams");
const express = require("express");

const router = new express.Router();

router.get('/next_exam', async (req, res) => {
	try {
		// Filter empty title to ignore special exams
		const exam = await Exams.findOne({ start_at: { "$gt": new Date() }, title: "" })
			.sort({ start_at: 1 })
			.populate("watchers");
		return res.status(200).send(exam);
	}
	catch (e) {
		console.error(e);
		return res.status(500).send();
	}
});

module.exports = router;

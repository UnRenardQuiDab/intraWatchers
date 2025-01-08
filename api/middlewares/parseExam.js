const Exams = require("../models/Exams");

module.exports = async function parseExam(req, res, next) {
	if (req.params.id) {
		const exam = await Exams.findById(req.params.id).populate('watchers');
		if (!exam) {
			return res.status(404).send();
		}
		req.exam = exam;
		return next();
	}
	return res.status(400).send();
}
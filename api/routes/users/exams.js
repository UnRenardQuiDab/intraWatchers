const express = require('express');
const Exams = require('../../models/Exams');

const router = new express.Router();

router.get('/', async (req, res) => {
	console.log('exams');
	const exams = await Exams.find({ watchers: req.user._id }).populate('watchers');
	res.status(200).send(exams);
});


module.exports = router;
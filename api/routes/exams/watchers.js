const express = require('express');
const Users = require('../../models/Users');
const { ExamForceRegisterLogs, ExamForceUnregisterLogs } = require('../../models/Log');

const router = new express.Router();

router.get('/', async (req, res) => {
	await req.exam.populate('watchers');
	res.status(201).send(req.exam.watchers);
});

router.post('/', async (req, res) => {
	const { login } = req.body;
	if (req.exam.watchers.find((watcher) => watcher.login === login)) {
		return res.status(400).send('User already watching this exam');
	}
	if (req.exam.watchers.length >= req.exam.nb_slots) {
		return res.status(400).send('No more slots available');
	}
	const user = await Users.findOne({ login });
	req.exam.watchers.push(user);
	await req.exam.save();
	const log = new ExamForceRegisterLogs({
		user: req.user,
		exam: req.exam,
		exam_date: req.exam.start_at,
		forced_user: user,
	});
	log.save();
	res.status(201).send(req.exam.watchers);
});

router.delete('/:login', async (req, res) => {
	const { login } = req.params;
	const watcher = req.exam.watchers.find((watcher) => watcher.login === login);
	req.exam.watchers = req.exam.watchers.filter((watcher) => watcher.login !== login);
	await req.exam.save();
	const log = new ExamForceUnregisterLogs({
		user: req.user,
		exam: req.exam,
		exam_date: req.exam.start_at,
		forced_user: watcher,
	})
	log.save();
	res.status(201).send(req.exam.watchers);
});

module.exports = router;
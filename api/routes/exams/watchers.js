const express = require('express');
const Users = require('../../models/Users');

const router = new express.Router();

router.get('/', async (req, res) => {
	await req.exam.populate('watchers');
	res.status(201).send(req.exam.watchers);
});

router.post('/', async (req, res) => {
	const { login } = req.body;
	console.log(login);
	if (req.exam.watchers.find((watcher) => watcher.login === login)) {
		return res.status(400).send('User already watching this exam');
	}
	if (req.exam.watchers.length >= req.exam.nb_slots) {
		return res.status(400).send('No more slots available');
	}
	const user = await Users.findOne({ login });
	req.exam.watchers.push(user);
	await req.exam.save();
	res.status(201).send(req.exam.watchers);
});

router.delete('/:login', async (req, res) => {
	const { login } = req.params;
	req.exam.watchers = req.exam.watchers.filter((watcher) => watcher.login !== login);
	await req.exam.save();
	res.status(201).send(req.exam.watchers);
});

module.exports = router;
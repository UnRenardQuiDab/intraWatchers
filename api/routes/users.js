const express = require("express");
const Users = require("../models/Users");
const Exams = require("../models/Exams");
const api42 = require("../api42");
const isStaff = require("../middlewares/isStaff");

const router = new express.Router();

router.get('/', async (req, res) => {
	const sort = req.query.sort || 'login';
	const page = req.query.page || 1;
	let pageSize = req.query.pageSize || 20;
	const login = req.query.login;
	const regex = new RegExp(login, 'i');
	if (pageSize > 100)
		pageSize = 100;
	try {
		const users = await Users.find({
			$or: [
				{ login: regex },
				{ firstname: regex }
			]
		}).sort(sort).limit(pageSize).skip((page - 1) * pageSize);
		const total = await Users.countDocuments({
			$or: [
				{ login: regex },
				{ firstname: regex }
			]
		});
		res.set('X-Total-Count', total);
		res.set('X-Page-Size', pageSize);
		res.set('X-Page-Count', total / pageSize);
		res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Page-Size, X-Page-Count');
		return res.status(200).send(users);
	}
	catch(e) {
		console.error(e);
		return res.status(400).send();
	}
});

router.post('/', isStaff, async (req, res) => {
	const {login} = req.body;
	try {
		const intraUser = await api42.getUser(login);
		if (!intraUser) {
			return res.status(404).send();
		}
		const groups = await api42.fetch(`/v2/users/${intraUser.login}/groups`);
		const user = new Users({
			login: intraUser.login,
			firstname: intraUser.first_name,
			lastname: intraUser.last_name,
			image_url: intraUser.image.link,
			groups: groups.map(group => group.name)
		});
		await user.save();
		return res.status(201).send(user);
	}
	catch(e) {
		return res.status(400).send();
	}
});

router.get('/:login/exams', async (req, res) => {
	const login = req.params.login;
	try {
		const user = await Users.findOne({ login});
		if (!user) {
			return res.status(404).send();
		}
		const exams = await Exams.find({watchers: user._id, start_at: {$gt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}});
		return res.status(200).send(exams);
	}
	catch(e) {
		return res.status(400).send();
	}
});

module.exports = router;
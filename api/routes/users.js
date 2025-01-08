const express = require("express");
const Users = require("../models/Users");
const api42 = require("../api42");

const router = new express.Router();

router.get('/', async (req, res) => {
	const login = req.query.login;
	const regex = new RegExp(login, 'i');
	const users = await Users.find({
        $or: [
            { login: regex },
            { firstname: regex }
        ]
    }).sort({ login: 1 }).limit(20);
	return res.status(200).send(users);
});

router.post('/', async (req, res) => {
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

module.exports = router;
// routes get avec filtre sur le type d'event (possible de plusieurs types)
// date debut et date fin
// pagination
// sort custom possible


const express = require('express');
const {Logs: Log} = require('../models/Log');
const Users = require('../models/Users');

const router = new express.Router();

router.get('/', async (req, res) => {
	const sort = req.query.sort || '-created_at';
	const page = req.query.page || 1;
	const pageSize = req.query.pageSize || 20;
	const user_query = req.query.query || {};
	if (user_query.user) {
		const user = await Users.findOne({ login: user_query.user });
		if (!user)
			return res.status(200).send([]);
		user_query.user = user._id;
	}
	if (user_query.forced_user) {
		const user = await Users.findOne({ login: user_query.forced_user });
		if (!user)
			return res.status(200).send([]);
		user_query.forced_user = user._id;
	}
	if (user_query.event_types) {
		user_query.__t = { $in: user_query.event_types.split(',') };
		delete user_query.event_types;
	}
	try {
		const logs = await Log.find(user_query).sort(sort).skip((page - 1) * pageSize).limit(pageSize).populate('user').populate('forced_user').populate('exam');
		return res.status(200).send(logs);
	}
	catch(e) {
		console.log(e);
		return res.status(400).send();
	}
});

module.exports = router;
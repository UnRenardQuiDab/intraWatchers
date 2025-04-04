const mongoose = require('mongoose');
const express = require('express');
const {Logs} = require('../models/Logs');
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
	if (user_query.exam) {
		try {
			user_query.exam = new mongoose.Types.ObjectId(user_query.exam);
		}
		catch {
			return res.status(200).send([]);
		}
	}
	try {
		const logs = await Logs.find(user_query).sort(sort).skip((page - 1) * pageSize).limit(pageSize).populate('user').populate('forced_user').populate('exam');
		const total = await Logs.countDocuments(user_query);
		res.set('X-Total-Count', total);
		res.set('X-Page-Size', pageSize);
		res.set('X-Page-Count', total / pageSize);
		res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Page-Size, X-Page-Count');
		return res.status(200).send(logs);
	}
	catch(e) {
		return res.status(400).send();
	}
});

module.exports = router;
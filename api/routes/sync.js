const express = require("express");
const api42 = require("../api42");
const isStaff = require("../middlewares/isStaff");
const Users = require("../models/Users");
const router = new express.Router();

router.get('/users', isStaff, async (req, res) => {
	const diffs = [];

	try {
		for (const user of await Users.find({})) {
			const watches = await api42.fetch(`/v2/users/${user.login}/transactions?filter[reason]=Surveillance d'Exam`, { pageSize: 100 });
			if (user.nb_watch !== watches.length) {
				diffs.push({
					login: user.login,
					intra: watches.length,
					app: user.nb_watch,
					diff: user.nb_watch - watches.length
				});
			}
		}
	}
	catch (e) {
		console.error(e);
		return res.status(500).send("Internal server error");
	}

	return res.status(200).send(diffs);
});

module.exports = router;

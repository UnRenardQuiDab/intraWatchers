const Users = require("../models/Users");

module.exports = async function parseUser(req, res, next) {
	if (req.params.login) {
		const user = await Users.findOne({ login: req.params.login });
		if (user) {
			req.user = user;
			return next();
		}
		return res.status(404).send();
	}
	return res.status(400).send();
}
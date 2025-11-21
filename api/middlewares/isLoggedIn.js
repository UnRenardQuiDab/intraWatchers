const Users = require("../models/Users");

module.exports = async function isLoggedIn(req, res, next) {
	if (!req.session.user) {
		return res.status(401).send('Unauthorized');
	}
	req.user = await Users.findOne({ login: req.session.user.login });
	return next();
}
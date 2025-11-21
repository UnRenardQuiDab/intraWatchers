const express = require("express");
const api42 = require("../api42");
const isLoggedIn = require("../middlewares/isLoggedIn");
const Users = require("../models/Users");
const router = new express.Router();

router.get('/42', (req, res) => {
	res.redirect(api42.getOAuthUrl());
});
  
router.get('/42/callback', async (req, res) => {
	const code = req.query.code;
	try {

		const token = await api42.generateUserToken(code);

		const me = await api42.whoAmI(token);

		const groups = await api42.fetch(`/v2/users/${me.id}/groups`);

		const existingUser = await Users.findOne({ login: me.login });

		req.session.user = {
			login: me.login,
			token
		}

		await Users.findOneAndUpdate(
			{ login: me.login },
			{
				login: me.login,
				is_staff: existingUser?.is_staff ?? me['staff?'],
				firstname: me.first_name,
				lastname: me.last_name,
				image_url: me.image.link,
				groups: groups.map(group => group.name.charAt(0).toUpperCase() + group.name.slice(1)).filter(g => g === 'Watcher' || g === 'Tutor'),
			},
			{ new: true, upsert: true, useFindAndModify: false }
		);

		await req.session.save();
	}
	catch (e) {
		console.error(e);
		return res.status(500).send("Internal server error");
	}

	return res.status(200).redirect(process.env.FRONTEND_URL);

});

router.get('/logout', isLoggedIn, async (req, res) => {
	try {
        await req.session.destroy();
    } catch (e) {
        console.error(e);
        return res.status(500).send('Error logging out');
    }
	return res.status(200).redirect(process.env.FRONTEND_URL);
});

module.exports = router;
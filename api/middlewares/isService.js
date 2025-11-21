module.exports = function isService(req, res, next) {
	try {
		const auth = req.get('Authorization');
		if (!auth || typeof auth !== 'string') {
			return res.status(401).send({ error: 'Unauthorized' });
		}
		const m = auth.match(/^Bearer\s+(.+)$/i);
		if (!m) {
			return res.status(401).send({ error: 'Invalid Authorization header' });
		}
		const token = m[1];

		if (!process.env.API_BEARER_TOKEN) {
			return res.status(503).send({ error: 'Service Unavailable: API_BEARER_TOKEN not configured' });
		}

		if (process.env.API_BEARER_TOKEN && token === process.env.API_BEARER_TOKEN) {
			req.isService = true;
			return next();
		}

		return res.status(401).send({ error: 'Unauthorized' });
	} catch (err) {
		console.error('isService middleware error', err);
		return res.status(500).send({ error: 'Internal error' });
	}
};

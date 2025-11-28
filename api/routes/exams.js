const isStaff = require("../middlewares/isStaff");
const parseExam = require("../middlewares/parseExam");
const Exams = require("../models/Exams");
const express = require("express");
const { ExamCreationLogs, ExamDeletionLogs, ExamArchiveLogs, ExamUnregisterLogs, ExamRegisterLogs } = require("../models/Logs");
const env = require("../env");
const Mutex = require('async-mutex').Mutex;

const router = new express.Router();

router.get('/', async (req, res) => {
	const {
		sort,
		page = 1,
		page_size = 20,
		filter = {}
	} = req.query;

	const pageSize = Math.min(page_size, 100);
	if (pageSize < 1) {
		return res.status(400).send("Invalid page size");
	}

	try {
		let exams = [];
		if (page > 0) {
			exams = await Exams.find(filter)
				.sort(sort)
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.populate('watchers');
		}
		const total = await Exams.countDocuments(filter);
		res.set('X-Total-Count', total);
		res.set('X-Page-Size', pageSize);
		res.set('X-Page-Count', Math.ceil(total / pageSize));
		res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Page-Size, X-Page-Count');
		return res.status(200).send(exams);
	}
	catch (e) {
		console.error(e);
		return res.status(400).send();
	}
});

router.post('/', isStaff, async (req, res) => {
	const { start_at, duration, authorized_groups, nb_slots, title, is_archived } = req.body;
	try {
		const exam = new Exams({
			start_at,
			duration,
			authorized_groups,
			nb_slots,
			is_archived,
			title
		});
		await exam.save();
		const log = new ExamCreationLogs({
			user: req.user._id,
			exam: exam._id,
			exam_date: exam.start_at
		});
		log.save();
		if (exam.is_archived) {
			const achive_log = new ExamArchiveLogs({
				user: req.user._id,
				exam: exam._id,
				exam_date: exam.start_at
			});
			achive_log.save();
		}
		return res.status(201).send(exam);
	}
	catch (e) {
		return res.status(400).send();
	}
});

router.delete('/:id', isStaff, async (req, res) => {
	try {
		const exam = await Exams.findByIdAndDelete(req.params.id);
		if (!exam) {
			return res.status(404).send();
		}
		const log = new ExamDeletionLogs({
			user: req.user._id,
			exam: exam._id,
			exam_date: exam.start_at
		});
		log.save();
		return res.status(200).send(exam);
	}
	catch {
		return res.status(400).send();
	}
});

router.post('/:id/register', async (req, res) => {
	try {
		const exam = await Exams.findById(req.params.id);
		let is_authorized = false;
		if (!exam) {
			return res.status(404).send();
		}
		const end_at = new Date(new Date(exam.start_at).setHours(new Date(exam.start_at).getHours() + exam.duration));
		if (end_at < new Date())
			return res.status(403).send("This exam is already finished");
		if (exam.watchers.length >= exam.nb_slots)
			return res.status(400).send("No more slots available");
		if (exam.watchers.includes(req.user._id))
			return res.status(400).send("You are already registered");
		for (const group of req.user.groups) {
			if (exam.authorized_groups.includes(group)) {
				is_authorized = true;
				break;
			}
		}
		if (!is_authorized && !req.user.is_staff) {
			return res.status(403).send("You are not authorized to register to this exam");
		}
		let watch_has_experience = true;
		if (exam.watchers.length == exam.nb_slots - 1) {
			watch_has_experience = false;
			await exam.populate('watchers');
			for (const watcher of exam.watchers) {
				if (watcher.nb_watch >= env.NEWBIE_COUNT) {
					watch_has_experience = true;
					break;
				}
			}
		}

		if (!watch_has_experience && req.user.nb_watch < env.NEWBIE_COUNT)
			return res.status(400).send("An exam must include at least one experienced watcher");
		exam.watchers.push(req.user._id);
		await exam.save();
		await exam.populate('watchers');
		const log = new ExamRegisterLogs({
			user: req.user._id,
			exam: exam._id,
			exam_date: exam.start_at
		});
		log.save();
		return res.status(200).send(exam.watchers);
	}
	catch (e) {
		console.error(e);
		return res.status(400).send();
	}
});

router.post('/:id/unregister', async (req, res) => {
	try {
		const exam = await Exams.findById(req.params.id);
		if (!exam) {
			return res.status(404).send();
		}
		const end_at = new Date(new Date(exam.start_at).setHours(new Date(exam.start_at).getHours() + exam.duration));
		if (end_at < new Date())
			return res.status(403).send("This exam is already finished");
		exam.watchers = exam.watchers.filter(watcher => !watcher.equals(req.user._id));
		await exam.save();
		await exam.populate('watchers');
		const log = new ExamUnregisterLogs({
			user: req.user._id,
			exam: exam._id,
			exam_date: exam.start_at
		});
		log.save();
		return res.status(200).send(exam.watchers);
	}
	catch {
		return res.status(400).send();
	}
});


const mutex = new Mutex();

router.post('/:id/archive', isStaff, async (req, res) => {
	const release = await mutex.acquire();

	try {
		const exam = await Exams.findById(req.params.id).populate('watchers');
		if (!exam) {
			throw { status: 404, message: 'Exam not found' };
		}
		if (exam.is_archived) {
			throw { status: 400, message: 'This exam is already archived' };
		}
		if (exam.start_at > new Date()) {
			throw { status: 400, message: 'This exam has not started yet' };
		}

		try {
			const rewards = await fetch(process.env.INTRA_PROXY_ENDPOINT, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${process.env.INTRA_PROXY_SECRET}`,
					'Content-Type': `application/json`
				},
				body: JSON.stringify({
					target: exam.watchers.map(w => w.login),
					value: (exam.duration > 3 ? exam.duration + 1 : exam.duration) * 5,
					reason: "Surveillance d'Exam",
					transactable_type: "Tuteurs"
				})
			});
			if (!rewards.ok) {
				throw await rewards.json();
			}
		} catch (err) {
			console.error(err);
			throw { status: 502, message: 'Error awarding Altarian Dollars' };
		}

		exam.is_archived = true;
		for (const watcher of exam.watchers) {
			if (!watcher.last_watch || watcher.last_watch < exam.start_at)
				watcher.last_watch = exam.start_at;
			watcher.nb_watch = (watcher.nb_watch || 0) + 1;
			await watcher.save();
		}
		await exam.save();
		const log = new ExamArchiveLogs({
			user: req.user._id,
			exam: exam._id,
			exam_date: exam.start_at
		});
		await log.save();

		res.status(200).send(exam);
	}
	catch (e) {
		if (e && e.status) {
			res.status(e.status).send(e.message);
		} else {
			console.error(e);
			res.status(500).send("Internal server error");
		}
	}
	finally {
		release();
	}
});

router.use('/:id/watchers', parseExam, require('./exams/watchers'));

module.exports = router;

const insertRow = require("../google");
const isStaff = require("../middlewares/isStaff");
const parseExam = require("../middlewares/parseExam");
const Exams = require("../models/Exams");
const express = require("express");
const { ExamCreationLogs, ExamDeletionLogs, ExamArchiveLogs, ExamUnregisterLogs, ExamRegisterLogs } = require("../models/Log");

const router = new express.Router();

router.get('/', async (req, res) => {
	const exams = await Exams.find({
		is_archived: false,
	}).sort({ start_at: 1 }).populate('watchers');
	return res.status(200).send(exams);
});

router.post('/', isStaff, async (req, res) => {
	const { start_at, duration, authorized_groups, nb_slots, title } = req.body;
	try {
		const exam = new Exams({
			start_at,
			duration,
			authorized_groups,
			nb_slots,
			title
		});
		await exam.save();
		const log = new ExamCreationLogs({
			user: req.user._id,
			exam: exam._id,
			exam_date: exam.start_at
		});
		log.save();
		return res.status(201).send(exam);
	}
	catch(e) {
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
				if (watcher.nb_watch > 0)
				{
					watch_has_experience = true;
					break;
				}
			}
		}
		if (!watch_has_experience && req.user.nb_watch == 0 && !req.user.is_staff)
			return res.status(400).send("You need to have at least one watch to register");
		exam.watchers.push(req.user._id);
		await exam.save();
		await exam.populate('watchers');
		const log = new ExamRegisterLogs({
			user: req.user._id,
			exam: exam._id,
			exam_date: exam.start_at
		});
		log.save();
		return res.status(200).send(exam);
	}
	catch(e) {
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
		// const end_at = new Date(new Date(exam.start_at).setHours(new Date(exam.start_at).getHours() + exam.duration));
		// if (end_at < new Date())
		// 	return res.status(400).send("This exam is already finished");
		exam.watchers = exam.watchers.filter(watcher => !watcher.equals(req.user._id));
		await exam.save();
		await exam.populate('watchers');
		const log = new ExamUnregisterLogs({
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

router.post('/:id/archived', isStaff, async (req, res) => {
	try {
		const exam = await Exams.findById(req.params.id).populate('watchers');
		if (!exam) {
			return res.status(404).send("Exam not found");
		}
		if (exam.is_archived)
			return res.status(400).send("This exam is already archived");
		if (exam.start_at > new Date())
			return res.status(400).send("This exam is not started yet");
		exam.is_archived = true;
		for (const watcher of exam.watchers) {
			if (watcher.last_watch < exam.start_at)
				watcher.last_watch = exam.start_at;
			watcher.nb_watch++;
			try {
				await insertRow(watcher.login, exam.start_at);
			}
			catch {
				return res.status(500).send("Error while updating the spreadsheet");
			}
			await watcher.save();
		}
		await exam.save();
		const log = new ExamArchiveLogs({
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

router.use('/:id/watchers', parseExam, require('./exams/watchers'));

module.exports = router;
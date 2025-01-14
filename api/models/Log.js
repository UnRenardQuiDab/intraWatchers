const mongoose = require('../db');

// logs
// Exam register
// Exam unregister
// Exam force register (by admin)
// Exam force unregister (by admin)
// Exam creation (by admin)
// Exam deletion (by admin)
// Exam archive (by admin)

const logSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
	created_at: { type: Date, default: Date.now },
});

const Logs = mongoose.model('Logs', logSchema);
const ExamLogsSchema = new mongoose.Schema({
	exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exams', required: true },
	exam_date: { type: Date, required: true },
});
const ExamRegisterLogs = Logs.discriminator('ExamRegisterLogs', ExamLogsSchema);
const ExamUnregisterLogs = Logs.discriminator('ExamUnregisterLogs', ExamLogsSchema);
const ExamCreationLogs = Logs.discriminator('ExamCreationLogs', ExamLogsSchema);
const ExamDeletionLogs = Logs.discriminator('ExamDeletionLogs', ExamLogsSchema);
const ExamArchiveLogs = Logs.discriminator('ExamArchiveLogs', ExamLogsSchema);
const ExamForceLogsSchema = new mongoose.Schema({
	exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exams', required: true },
	exam_date: { type: Date, required: true },
	forced_user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});
const ExamForceRegisterLogs = Logs.discriminator('ExamForceRegisterLogs', ExamForceLogsSchema);
const ExamForceUnregisterLogs = Logs.discriminator('ExamForceUnregisterLogs', ExamForceLogsSchema);


module.exports = {
	Logs,
	ExamRegisterLogs,
	ExamUnregisterLogs,
	ExamForceRegisterLogs,
	ExamForceUnregisterLogs,
	ExamCreationLogs,
	ExamDeletionLogs,
	ExamArchiveLogs
}
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
});

const Log = mongoose.model('Logs', logSchema);
const ExamLogSchema = new mongoose.Schema({
	exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exams', required: true },
	exam_date: { type: Date, required: true },
});
const ExamRegisterLog = Log.discriminator('ExamRegisterLogs', ExamLogSchema);
const ExamUnregisterLog = Log.discriminator('ExamUnregisterLogs', ExamLogSchema);
const ExamCreationLog = Log.discriminator('ExamCreationLogs', ExamLogSchema);
const ExamDeletionLog = Log.discriminator('ExamDeletionLogs', ExamLogSchema);
const ExamArchiveLog = Log.discriminator('ExamArchiveLogs', ExamLogSchema);
const ExamForceLogSchema = new mongoose.Schema({
	exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exams', required: true },
	exam_date: { type: Date, required: true },
	forced_user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});
const ExamForceRegisterLog = Log.discriminator('ExamForceRegisterLogs', ExamForceLogSchema);
const ExamForceUnregisterLog = Log.discriminator('ExamForceUnregisterLogs', ExamForceLogSchema);


module.exports = {
	Log,
	ExamRegisterLog,
	ExamUnregisterLog,
	ExamForceRegisterLog,
	ExamForceUnregisterLog,
	ExamCreationLog,
	ExamDeletionLog,
	ExamArchiveLog
}
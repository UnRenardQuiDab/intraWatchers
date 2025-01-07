import { Status } from "./ui/status";

export default function ExamStatus({ exam, ...props }) {
	if (!exam.is_archived && exam.end_at < new Date())
		return (
			<Status size='sm' {...props} value="warning">
				Awaiting Review
			</Status>
		)
	if (!exam.is_archived && exam.start_at < new Date())
		return (
			<Status size='sm' {...props} value="success">
				In Progress
			</Status>
		)
	if (exam.is_archived)
		return (
			<Status size='sm' {...props} value='info' >
				Archived
			</Status>
		)
}
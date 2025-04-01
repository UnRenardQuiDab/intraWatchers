import { Center, HStack, Spinner, Stack } from "@chakra-ui/react"
import ExamLastWatch from "./ExamLastWatch"
import ExamStats from "./ExamStats"
import LineExamsChart from "./LineExamsChart"
import ExamCarousel from "./ExamCarousel"
import { useEffect, useState } from "react"

export default function UserExamStats({ user }) {
	
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchExams = async () => {
		setLoading(true);
		const data = await user.getExams();
		setExams(data);
		setLoading(false);
	}
	
	useEffect(() => {
		fetchExams();
	}, []);

	if (!user) return null;

	if (loading)
		return <Center> <Spinner />Loading... </Center>

	return <Stack>
			<HStack>
				<ExamLastWatch lastWatch={user.last_watch && new Date(user.last_watch)} />
				<ExamStats label={'Watch count'} value={user.nb_watch} />
			</HStack>
			{exams?.length > 0 && <>
				<LineExamsChart exams={exams.filter(exam => exam.is_archived)} />
				<ExamCarousel exams={exams} />
			</>}
		</Stack>

}
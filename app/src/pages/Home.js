import { useExams } from "../context/useExams";
import ExamMonthSection from "../components/ExamMonthSection";
import ProfileCard from "../components/ProfileCard";
import { Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { FaClockRotateLeft, FaHouse, FaRightFromBracket } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ExamCreationForm from "../components/ExamCreationForm";
import { useMe } from "../context/useMe";

export default function Home() {

	const { exams, create } = useExams();
	const { me } = useMe();

	const splitExams = (exams) => {
		let months = [];
		exams.forEach(exam => {
			const month = new Date(exam.start_at).toLocaleString('default', { month: 'long' });
			const year = new Date(exam.start_at).getFullYear();
			if (months.find((m) => m.month === month && m.year === year))
				return;
			months.push({month, year});
		})
		return months;
	}


	const [months, setMonths] = useState([]);
	useEffect(() => {
		setMonths(splitExams(exams));
	}, [exams]);

	if (months && me)
	return (
		<Flex>
			<Stack
				h='100vh'
				minWidth='250px'
				w='18%'
				background='bg.subtle'
				padding='8px'
			>
				<ProfileCard w='100%' user={me}/>
				<Separator w='100%' />
				<Stack w='100%'>
					<Button w='100%' variant='ghost' display='flex' justifyContent='space-between'>Home <FaHouse/></Button>
					<Button w='100%' variant='ghost' display='flex' justifyContent='space-between'>History <FaClockRotateLeft /></Button>
				</Stack>
				<Separator w='100%' />
				<Button w='100%' variant='solid' colorPalette='red' display='flex' justifyContent='space-between'>Logout <FaRightFromBracket/></Button>
			</Stack>
			<Stack
				h='100vh'
				w='82%'
				padding='8px'
				overflowY='auto'
			>
				{months.map((date) => (
					<ExamMonthSection key={date.month + date.year} year={date.year} month={date.month} exams={
						exams.filter(exam =>
							new Date(exam.start_at).toLocaleString('default', { month: 'long' }) === date.month &&
							new Date(exam.start_at).getFullYear() === date.year
						)
					} />
				))}
			</Stack>
			{ me.is_staff && <ExamCreationForm onCreate={create} />}
		</Flex>
	);
}
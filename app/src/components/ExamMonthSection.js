import { Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import ExamCard from "./ExamCard";

export default function ExamMonthSection({ year, month, exams }) {
	console.log('exams', month, exams);
	return (
		<Stack>
			<Flex alignItems='center' gap='4px'>
				<Heading>{month}</Heading>
				<Text color='fg.muted'>({year})</Text>
			</Flex>
			<Grid
				width='100%'
				gap='8px'
				templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
			>
				{exams.map((exam) => (
					<ExamCard key={exam._id} exam={exam}/>
				))}
			</Grid>
		</Stack>
	);
}
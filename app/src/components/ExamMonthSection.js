import { Flex, Grid, Heading, Stack } from "@chakra-ui/react";
import ExamCard from "./ExamCard";

export default function ExamMonthSection({ month, exams }) {
	return (
		<Stack>
			<Heading>{month}</Heading>
			<Flex
				width='100%'
				gap='8px'
			>
				<ExamCard />
				<ExamCard />
				<ExamCard />
			</Flex>
		</Stack>
	);
}
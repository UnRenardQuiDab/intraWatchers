import { HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ExamCard from "./ExamCard";
import { useState } from "react";

export default function ExamCarousel({ exams }) {

	const [current, setCurrent] = useState(0);
	
	if (!exams.length)
		return null;

	return (<Stack>
		<ExamCard exam={exams[current]} />
		<HStack justify='center'>
			<IconButton
				variant='ghost'
				disabled={current === 0}
				onClick={() => setCurrent(current - 1)}
				>
				<LuChevronLeft />
			</IconButton>
			<Text>{current + 1} / {exams.length}</Text>
			<IconButton
				variant='ghost'
				disabled={current === exams.length - 1}
				onClick={() => setCurrent(current + 1)}
				>
				<LuChevronRight />
			</IconButton>
		</HStack>
	</Stack>)
}
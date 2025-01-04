import ExamMonthSection from "../components/ExamMonthSection";
import ProfileCard from "../components/ProfileCard";
import { Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { FaClockRotateLeft, FaHouse, FaRightFromBracket } from "react-icons/fa6";


export default function Home() {

	return (
		<Flex>
			<Stack
				h='100vh'
				minWidth='250px'
				w='18%'
				background='gray.800'
				padding='8px'
			>
				<ProfileCard w='100%'/>
				<Separator w='100%' />
				<Stack w='100%'>
					<Button w='100%' variant='ghost' display='flex' justifyContent='space-between'>Home <FaHouse/></Button>
					<Button w='100%' variant='ghost' display='flex' justifyContent='space-between'>History <FaClockRotateLeft /></Button>
					<Button marginTop='16px' w='100%' variant='solid' colorPalette='red' display='flex' justifyContent='space-between'>Logout <FaRightFromBracket/></Button>
				</Stack>
				<Separator w='100%' />
			</Stack>
			<Stack
				h='100vh'
				w='80%'
				padding='8px'
			>
				<ExamMonthSection month='January' />
			</Stack>
		</Flex>
	);
}
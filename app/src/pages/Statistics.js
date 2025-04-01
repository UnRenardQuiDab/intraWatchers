import { Flex, Grid, GridItem, Heading, PopoverArrow } from "@chakra-ui/react";
import { useMe } from "../context/useMe";
import LeftNavTemplate from "../templates/LeftNavTemplate";
import ExamStats from "../components/ExamStats";
import ExamLastWatch from "../components/ExamLastWatch";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "../components/ui/popover";
import LeaderBoard from "../components/LeaderBoard";
import ApplePieExams from "../components/ApplePieExams";
import LineExamsChart from "../components/LineExamsChart";
import LastArchivedTimeLine from "../components/LastArchivedTimeLine";
import { useEffect, useState } from "react";

export default function Statistics() {
	
	const { me, getMyExams } = useMe();

	const [exams, setExams] = useState([]);

	useEffect(() => {
		if (me)
			getMyExams().then((exams) => {
				setExams(exams.filter(exam => exam.is_archived));
			})
		// eslint-disable-next-line
	}, [me]);

	const examAchivement = me && [{
		label: "Life Guard",
		completed: me.nb_watch >= 6,
		needed: 6
	}, {
		label: "Achivement 1/2",
		completed: me.nb_watch >= 12,
		needed: 12
	}, {
		label: "Achivement 2/2",
		completed: me.nb_watch >= 21,
		needed: 21
	}].sort((a, b) => a.completed - b.completed)

	if (me)
	return (
		<LeftNavTemplate me={me}>
			<Heading>Statistics</Heading>
			<Grid
				templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(4, 1fr)"]}
				templateRows={["repeat(14, 15vh)", "repeat(14, 1fr)", "repeat(14, 1fr)", "repeat(14, 1fr)", "repeat(14, 1fr)", "repeat(6, 1fr)"]}
				gap='16px'
				// h={['95%']}
				w='100%'
			>
				<GridItem colSpan={1} rowSpan={1}>
					<ExamStats
						label={"Total Exams"}
						value={me.nb_watch}
					/>
				</GridItem>
				<GridItem colSpan={1} rowSpan={1}>
					<PopoverRoot lazyMount unmountOnExit>
						<PopoverTrigger asChild>
							<ExamStats
								label={examAchivement[0].label}
								value={me.nb_watch}
								needed={examAchivement[0].needed}
							/> 
						</PopoverTrigger>
						<PopoverContent>
							<PopoverArrow />
							<PopoverBody gap='8px' display='flex' flexDir='column'>
								<ExamStats
									label={examAchivement[1].label}
									value={me.nb_watch}
									needed={examAchivement[1].needed}
								/>
								<ExamStats
									label={examAchivement[2].label}
									value={me.nb_watch}
									needed={examAchivement[2].needed}
								/>
							</PopoverBody>
						</PopoverContent>
					</PopoverRoot>
				</GridItem>
				<GridItem colSpan={1} rowSpan={1}>
					<ExamLastWatch
						lastWatch={me.last_watch ? new Date(me.last_watch) : null}
					/>
				</GridItem>
				<GridItem colSpan={1} rowSpan={1}>
					<ExamStats
						label={"Total Wallet"}
						value={me.nb_watch * 15 + ' ₳'}
					/>
				</GridItem>
				<GridItem colSpan={1} rowSpan={5}>
					<LeaderBoard
						w='100%'
						h='100%'
					/>
				</GridItem>
				<GridItem colSpan={[1, 1, 1, 1, 1, 2]} rowSpan={3}>
					<ApplePieExams/>
				</GridItem>
				<GridItem colSpan={1} rowSpan={3}>
					<LastArchivedTimeLine
					/>
				</GridItem>
				<GridItem colSpan={[1, 1, 1, 1, 1, 3]} rowSpan={2}>
					<LineExamsChart
						exams={exams}
					/>
				</GridItem>
			</Grid>
			<Flex>

			</Flex>
		</LeftNavTemplate>
	)
}
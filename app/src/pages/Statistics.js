import { Collapsible, Flex, Grid, GridItem, Heading, PopoverArrow } from "@chakra-ui/react";
import { useMe } from "../context/useMe";
import LeftNavTemplate from "../templates/LeftNavTemplate";
import ExamStats from "../components/ExamStats";
import ExamLastWatch from "../components/ExamLastWatch";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import LeaderBoard from "../components/LeaderBoard";

export default function Statistics() {
	
	const { me } = useMe();

	const examGoals = [6, 12, 21];

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
			<Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(6, 1fr)" gap='16px' h='100%'>
				<ExamStats
					label={"Total Exams"}
					value={me.nb_watch}
				/>
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
				<ExamLastWatch
					lastWatch={me.last_watch ? new Date(me.last_watch) : null}
				/>
				<ExamStats
					label={"Total Wallet"}
					value={me.nb_watch * 15 + ' ₳'}
				/>
				<GridItem colSpan={1} rowSpan={5}>
				
					<LeaderBoard
						w='100%'
						h='100%'
					/>
				</GridItem>
			</Grid>
			<Flex>

			</Flex>
		</LeftNavTemplate>
	)
}
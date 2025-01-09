import { Grid, Heading, HStack } from "@chakra-ui/react";
import { useMe } from "../context/useMe";
import LeftNavTemplate from "../templates/LeftNavTemplate";
import ExamStats from "../components/ExamStats";

export default function Statistics() {
	
	const { me } = useMe();

	if (me)
	return (
		<LeftNavTemplate me={me}>
			<Heading>Statistics</Heading>
			<Grid templateColumns="repeat(4, 1fr)" gap='16px'>
				<ExamStats
					label={"Total Exams"}
					value={me.nb_watch}
				/>
				<ExamStats
					label={"Life Guard"}
					value={me.nb_watch}
					needed={6}
				/>
			</Grid>
		</LeftNavTemplate>
	)
}
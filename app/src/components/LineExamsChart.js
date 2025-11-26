import { Box, Card, useToken } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";

export default function LineExamsChart({ exams, ...props }) {

	const getLast12Months = () => {
		const months = [];
		const date = new Date();
		for (let i = 0; i < 12; i++) {
		  months.push(
			new Date(date.getFullYear(), date.getMonth() - i, 1)
		  );
		}
		return months.reverse();
	};

	const getData = () => {
		return getLast12Months().map(date => {
			return exams.filter(exam => {
				const examDate = new Date(exam.start_at);
				return examDate.getMonth() === date.getMonth() && examDate.getFullYear() === date.getFullYear();
			}).length
		});
	}



	const [color] = useToken("colors", ["blue.500"]);

	const data = getData();

	if (data === 0) return null;
	return (
		<Card.Root {...props} h='100%' w='100%'>
		  <Card.Body
			w='100%'
			display='flex'
			flexDir='column'
			h='100%'
			overflow='auto'
		  >
			<Card.Title flex={1}>Watch per month</Card.Title>
			<Box w='100%' flex={6}>
				<Line
					data={{
						labels: getLast12Months().map(date => date.toLocaleString("default", {month: "long"})),
						datasets: [{
							label: ' Watch',
							data: data,
							fill: false,
							borderColor: color,
							tension: 0.
						}]
					}}
					options={{
						plugins: {
							legend: {
							display: false,
							},
						},
						y: {
							ticks: {
							stepSize: 1
							}
						},
						maintainAspectRatio: false,
					}}
				/>
			</Box>
		  </Card.Body>
		</Card.Root>
	);
}
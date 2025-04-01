import { useMe } from "../context/useMe";
import { Box, Card, useToken } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function LineExamsChart({ exams, ...props }) {

	const getLast12Months = () => {
		const months = [];
		const date = new Date();
		for (let i = 0; i < 12; i++) {
		  months.push(
			new Date(date.getFullYear(), date.getMonth() - i, 1).toLocaleString("default", {
			  month: "long",
			})
		  );
		}
		return months.reverse();
	};

	const getData = () => {
		return getLast12Months().map(month =>
			exams.filter(exam => new Date(exam.start_at).toLocaleString("default", { month: "long" }) === month).length
		);
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
						labels: getLast12Months(),
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
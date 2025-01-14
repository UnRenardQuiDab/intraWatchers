import useUsers from "../hooks/useUsers";
import { Card, useToken } from "@chakra-ui/react";


import { Doughnut } from "react-chartjs-2";

export default function ApplePieExams({ ...props }) {

	const {users} = useUsers('-nb_watch -last_watch', 1, 50);

	const colors = useToken("colors", ["green.500", "blue.500", "purple.500", "orange.500", "red.500", "yellow.500", "pink.500", "cyan.500", "teal.500", "gray.500"]);

	return (
		<Card.Root {...props} h='100%' w='100%'>
      	<Card.Body
			position='relative'
			w='100%'
			h='100%'
		>
			<Card.Title position='absolute'>Watch distribution</Card.Title>
		  	<Doughnut
				data={{
					labels: users.map(user => user.login),
					datasets: [{
					  label: ' Watch count',
					  data: users.map(user => user.nb_watch),
					  hoverOffset: 0,
					  backgroundColor: colors
					}]
				}}
				options={{
					plugins: {
					  legend: {
						display: false,
					  },
					},
					maintainAspectRatio: false,
				  }}
			/>
		</Card.Body>
		</Card.Root>
	);
}
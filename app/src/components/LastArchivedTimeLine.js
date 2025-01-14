import { Card, Flex } from "@chakra-ui/react";

export default function LastArchivedTimeLine({ ...props }) {
	return (
		<Card.Root {...props} w='100%' h='100%'>
			<Card.Body>
				<Card.Title>Last archived exams</Card.Title>
				<Flex>
					No timeline archived yet.
				</Flex>
			</Card.Body>
		</Card.Root>
	)
}
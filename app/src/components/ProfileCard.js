import { Badge, Card, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";

export default function ProfileCard({...props}) {

	return (
		<Card.Root w='100%' {...props}>
			<Card.Body p='4' paddingBottom={0}>
				<HStack mb="6">
					<Avatar
						size="sm"
						name="Nate Foss"
						src="https://bit.ly/naruto-sage"
						/>
					<Stack gap="0">
						<Text fontWeight="semibold" textStyle="sm">
						Nate Foss 
						</Text>
						<Text color="fg.muted" textStyle="sm">
						@natefoss
						</Text>
					</Stack>
				</HStack>
			</Card.Body>
			<Card.Footer p='4' paddingTop={0}>
			<Flex
				gap='8px'
			>
				<Badge colorPalette="black">Watcher</Badge>
				<Badge colorPalette="yellow">Tutor</Badge>
			</Flex>
			</Card.Footer>
		</Card.Root>
	);
}
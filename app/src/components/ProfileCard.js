import { Card, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import GroupBadge from "./GroupBadge";

export default function ProfileCard({user, children, ...props}) {

	if (user)
		return (
			<Card.Root w='100%' {...props}>
				<Card.Header p='4' paddingBottom={0}>
					<HStack mb="6">
						<Avatar
							size="sm"
							name={`${user.firstname} ${user.lastname}`}
							src={user.image_url}
							/>
						<Stack gap="0">
							<Text fontWeight="semibold" textStyle="sm">
								{user.firstname} {user.lastname}
							</Text>
							<Text color="fg.muted" textStyle="sm">
								@{user.login}
							</Text>
						</Stack>
					</HStack>
				</Card.Header>
				<Card.Body p='4' paddingY={0}>
					<Flex
						gap='8px'
					>
						{user.groups.map((group) => (
							<GroupBadge key={group} group={group}/>
						))}
					</Flex>
				</Card.Body>
				<Card.Footer p='4' paddingTop={0}>
					{children}
				</Card.Footer>
			</Card.Root>
		);
}
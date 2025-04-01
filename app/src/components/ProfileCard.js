import { Card, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import GroupBadge from "./GroupBadge";

export default function ProfileCard({user, children, ...props}) {

	if (user)
		return (
			<Card.Root w='100%' gap='4' p='4' {...props}>
				<Card.Header p={0}>
					<HStack w='100%'>
						<Avatar
							size="sm"
							name={`${user.firstname} ${user.lastname}`}
							src={user.image_url}
							/>
						<Stack gap="0">
							<Text fontWeight="semibold" textStyle="sm">
								{user.firstname} {user.lastname} {user.is_staff && <GroupBadge group="Staff"/>}
							</Text>
							<Text color="fg.muted" textStyle="sm">
								@{user.login}
							</Text>
						</Stack>
					</HStack>
				</Card.Header>
				{user.groups.length > 0 && <Card.Body p={0}>
					<Flex
						gap='8px'
					>
						{user.groups.map((group) => (
							<GroupBadge key={group} group={group}/>
						))}
					</Flex>
				</Card.Body>}
				{ children && <Card.Footer p={0}>
					{children}
				</Card.Footer>}
			</Card.Root>
		);
}
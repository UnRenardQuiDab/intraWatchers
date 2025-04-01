import { Checkbox, Flex, Table, Text } from "@chakra-ui/react";
import GroupBadge from "./GroupBadge";
import { Avatar } from "./ui/avatar";
import UserDrawer from "./UserDrawer";

export default function UserTableRow({ user, onCheckedChange, checked }) {

	if (!user)
		return null;

	return (
		<Table.Row
			key={user._id}
			data-selected={checked ? '' : undefined}
		>
			<Table.Cell>
				<Checkbox.Root
					size="sm"
					top="0.5"
					aria-label="Select row"
					checked={checked}
					onCheckedChange={onCheckedChange}
				>
					<Checkbox.HiddenInput />
					<Checkbox.Control>
						<Checkbox.Indicator />
					</Checkbox.Control>
				</Checkbox.Root>
			</Table.Cell>
			<Table.Cell>
				<UserDrawer user={user}>
					<Flex
						alignItems="center"
						gap="2"
						cursor="pointer"
					>
						<Avatar
							size="sm"
							name={`${user.firstname} ${user.lastname}`}
							src={user.image_url}
							/>
						<Text
							fontWeight="bold"
							fontSize="sm"
							>
							{user.login}
						</Text>
					</Flex>
				</UserDrawer>
			</Table.Cell>
			<Table.Cell>
				{user.firstname} {user.lastname}
			</Table.Cell>
			<Table.Cell>
				{user.is_staff && <GroupBadge group="Staff"/>}
			</Table.Cell>
			<Table.Cell>
				<Flex gap="2" height="100%" alignItems="center">
					{user.groups.map((group) => <GroupBadge key={user._id+group} group={group}/>)}
				</Flex>
			</Table.Cell>
			<Table.Cell>
				{user.nb_watch}
			</Table.Cell>
		</Table.Row>
	);

}
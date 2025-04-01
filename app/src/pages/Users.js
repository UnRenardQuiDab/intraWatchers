import { useMe } from "../context/useMe";
import LeftNavTemplate from "../templates/LeftNavTemplate";
import {  ActionBar, Button, Field, HStack, Heading, IconButton, Input, Portal, SegmentGroup, Stack, Table } from "@chakra-ui/react"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../components/ui/pagination"
import useUsers from "../hooks/useUsers";
import UserTableRow from "../components/UserTableRow";
import { useState } from "react";
import { LuTrash2, LuUserSearch, LuX } from "react-icons/lu";
import ConfirmDialog from "../components/ConfirmDialog";
import CreateUserModal from "components/CreateUserModal";
import { InputGroup } from "components/ui/input-group";

export default function Users() {

	const { me } = useMe();

	const pageSize = 13;

	const {users, nbPages, setPageNumber, page, addUser, userSearch} = useUsers('login', 1, pageSize);

	const [selection, setSelection] = useState([]);

	const [loading, setLoading] = useState(false);

	if (!me)
		return null;

	const handleCheckedChange = (changes, user) => {
		setSelection((prev) =>
			changes.checked
			  ? [...prev, user]
			  : selection.filter((u) => u._id !== user._id),
		  )
	};

	const clearSelection = () => {
		setSelection([]);
	}

	const handleDelete = async () => {
		setLoading('deleting');
		for (const user of selection)
		{
			await user.delete();
		}
		setSelection([]);
		setLoading(false);
	}

	return (
		<LeftNavTemplate me={me}>
			<Stack width="full" height='100%' gap="5" justifyContent='space-between'>
				<Stack>
					<HStack justifyContent='space-between' alignItems='center'>
						<Heading size="xl">Users</Heading>
						<CreateUserModal createUser={addUser} />
					</HStack>
					<HStack justify={'flex-end'}>
						<InputGroup startElement={<LuUserSearch/>} minWidth="300px">
							<Input
								placeholder="Search user"
								onChange={(e) => userSearch(e.target.value)}
							/>
						</InputGroup>
					</HStack>
					<Table.Root size="sm" variant="outline">
						<Table.Header>
						<Table.Row>
							<Table.ColumnHeader w="6"/>
							<Table.ColumnHeader>Login</Table.ColumnHeader>
							<Table.ColumnHeader>Name</Table.ColumnHeader>
							<Table.ColumnHeader>Staff</Table.ColumnHeader>
							<Table.ColumnHeader>Groups</Table.ColumnHeader>
							<Table.ColumnHeader>Exams</Table.ColumnHeader>
						</Table.Row>
						</Table.Header>
						<Table.Body>
						{users.map((user) => (
							<UserTableRow
								key={user._id}
								user={user}
								checked={selection.find((u) => u._id === user._id) !== undefined}
								onCheckedChange={(e) => handleCheckedChange(e, user)}
							/>
						))}
						{users.length === 0 && (
							<Table.Row>
								<Table.Cell colSpan={6} textAlign="center">No user found</Table.Cell>
							</Table.Row>
						)}
						</Table.Body>
					</Table.Root>
				</Stack>

				<PaginationRoot
					count={Math.max(nbPages * pageSize, 1)}
					pageSize={pageSize}
					page={page}
					onPageChange={(e) => setPageNumber(e.page)}
				>
					<HStack wrap="wrap">
					<PaginationPrevTrigger />
					<PaginationItems />
					<PaginationNextTrigger />
					</HStack>
				</PaginationRoot>
			</Stack>
			<ActionBar.Root open={selection.length > 0}>
				<Portal>
					<ActionBar.Positioner>
						<ActionBar.Content>
							<ActionBar.SelectionTrigger>
								{selection.length} selected
							</ActionBar.SelectionTrigger>
							<ActionBar.Separator />
							<ConfirmDialog
								text={`Are you sure you want to delete ${selection.length} user${selection.length > 1 ? 's' : ''} ?`}
								onConfirm={handleDelete}
								confirmColor='red'
							>
								<Button
									variant="surface"
									size="sm"
									colorPalette='red'
									isLoading={loading === 'deleting'}
								>
									<LuTrash2/> Delete user{selection.length > 1 && 's'}
								</Button>
							</ConfirmDialog>
							<IconButton
								size="sm"
								variant='ghost'
								onClick={() => clearSelection()}
							>
								<LuX />
							</IconButton>
						</ActionBar.Content>
					</ActionBar.Positioner>
				</Portal>
			</ActionBar.Root>
		</LeftNavTemplate>
	);
}
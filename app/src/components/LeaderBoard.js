import { Card, HStack, Table } from "@chakra-ui/react";
import { PaginationNextTrigger, PaginationPageText, PaginationPrevTrigger, PaginationRoot } from "./ui/pagination";
import useUsers from "../hooks/useUsers";
import { Avatar } from "./ui/avatar";
import { FaUser } from "react-icons/fa6";
import { useMe } from "../context/useMe";

export default function LeaderBoard({...props}) {

	const {users, nbPages, setPageNumber, page} = useUsers('-nb_watch -last_watch', 1, 10, -1);
	const { me } = useMe();

	if (users && me)
	return (
		<Card.Root {...props} overflowY='auto'>
			<Card.Body gap="2">
				<Card.Title mt="2">Exams Leaderboard</Card.Title>
				<Table.Root size='md'>
					<Table.Header>
						<Table.Row bg='transparent'>
							<Table.ColumnHeader><FaUser/></Table.ColumnHeader>
							<Table.ColumnHeader>Login</Table.ColumnHeader>
							<Table.ColumnHeader>Count</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">Last</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{users.map((user) => (
							<Table.Row key={user._id}  bg={me.login === user.login ? 'bg.muted':'transparent'} >
								<Table.Cell><Avatar src={user.image_url} alt={user.login} size='2xs'/> </Table.Cell>
								<Table.Cell>
									{user.login}
								</Table.Cell>
								<Table.Cell>{user.nb_watch}</Table.Cell>
								<Table.Cell textAlign="end">{user.last_watch ? new Date(user.last_watch).toLocaleDateString('fr-FR') : '-'}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
			</Table.Root>
			</Card.Body>
			<Card.Footer>
				<PaginationRoot
					page={page}
					count={nbPages}
					pageSize={1}
					onPageChange={(e) => setPageNumber(e.page)}
					w='100%'
					display='flex'
					justifyContent='center'
				>
					<HStack gap="4">
						<PaginationPrevTrigger />
						<PaginationPageText />
						<PaginationNextTrigger />
					</HStack>
				</PaginationRoot>
			</Card.Footer>
		</Card.Root>
	)
}
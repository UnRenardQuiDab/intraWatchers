import config from "../config";
import { Box, Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function UserSearchInput({children, onValid, ...props}) {
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([]);
	const [open, setOpen] = useState(false);

	const fetchUsers = async () => {
		const res = await fetch(`${config.apiUrl}/users?login=${search}`, {
			credentials: 'include',
		});
		if (res.ok) {
			const data = await res.json();
			setUsers(data);
		}
	}

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line
	}, [search]);

	return (
		<DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>User Search</DialogTitle>
				</DialogHeader>
				<DialogBody>
					<Flex
						flexDir='column'
					>
						<Input
							placeholder='Search for a user...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						{ !(users.length === 1 && users[0].login === search) &&
							<Box
								width='100%'
								maxH={200}
								bg='bg.muted'
								overflowY='auto'
								padding='4px'
							>
								{users.map((user) => (
									<Flex key={user._id} gap='8px' alignItems='center' p='4px' onClick={() => setSearch(user.login)} cursor='pointer' _hover={{bg: 'bg.emphasized'}}>
										<Avatar size='xs' src={user.image_url} name={user.login} />
										{user.login}
									</Flex>
								))}
							</Box>
						}
					</Flex>
				</DialogBody>
				<DialogFooter>
					<DialogActionTrigger asChild>
						<Button variant="outline">Cancel</Button>
					</DialogActionTrigger>
					<Button
						disabled={!users.find((u) => u.login === search)}
						onClick={() => {onValid(search); setOpen(false); setSearch('')}}
					>
						Save
					</Button>
				</DialogFooter>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>

	)
}
import { Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { LuUserPlus } from "react-icons/lu";

export default function CreateUserModal({createUser}) {
	const ref = useRef(null);

	const [login, setLogin] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleLoginChange = (e) => {
		setLogin(e.target.value);
		setError(null)
	}

	const handleCreate = async () => {
		setLoading(true);
		try {
			await createUser(login);
			setIsOpen(false);
			setLogin('');
			setError(null)
			console.log('user created');
		}
		catch(error) {
			console.error(error);
			setError(error.message);
		}
		setLoading(false);
	}

	return (
		<Dialog.Root initialFocusEl={() => ref.current} open={isOpen} onOpenChange={(e)	=> setIsOpen(e.open)}>
		<Dialog.Trigger asChild>
			<Button
				variant="surface"
				colorPalette='blue'
				size="sm"
				onClick={() => console.log('create user')}
			>
				Create user <LuUserPlus/>
			</Button>
		</Dialog.Trigger>
		<Portal>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Add a new user</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body pb="4">
						<Stack gap="4">
							<Field.Root invalid={error} required>
								<Field.Label>Login <Field.RequiredIndicator /></Field.Label>
								<Input ref={ref} value={login} onChange={handleLoginChange} placeholder="login" />
								<Field.ErrorText>{error}</Field.ErrorText>
							</Field.Root>
						</Stack>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.ActionTrigger asChild>
							<Button variant="outline">Cancel</Button>
						</Dialog.ActionTrigger>
						<Button
							colorPalette='blue'
							onClick={handleCreate}
							loading={loading}
							disabled={!login}
						>
							Create <LuUserPlus/>
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
		</Dialog.Root>)
}
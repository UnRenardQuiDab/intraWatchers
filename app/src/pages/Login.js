import config from "../config";
import { Button, Center, Heading, Image } from "@chakra-ui/react";



export default function Login() {

	return (
		<Center
			h="100vh"
			w="100vw"
			flexDir='column'
			gap='3vh'
		>
			<Heading>
				Exam gathers, and now my watch begins.
			</Heading>
			<Button as='a' href={`${config.apiUrl}/auth/42`} >
				Login with 
				<Image src="https://www.universfreebox.com/wp-content/uploads/2019/07/logo_42.png" alt="42 logo" h="50%"/>
				Intra
			</Button>
		</Center>
	);
}
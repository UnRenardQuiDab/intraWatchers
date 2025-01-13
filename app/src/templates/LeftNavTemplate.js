import { FaClockRotateLeft, FaHouse, FaRightFromBracket } from "react-icons/fa6";
import ProfileCard from "../components/ProfileCard";
import { Button, Flex, Separator, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import config from "../config";

export default function LeftNavTemplate({ me, children }) {

	const path = window.location.pathname;

	return (
		<Flex>
			<Stack
				h='100vh'
				minWidth='250px'
				w='18%'
				background='bg.subtle'
				padding='8px'
				justifyContent='space-between'
			>
				<Stack w='100%'>
					<ProfileCard w='100%' user={me}/>
					<Separator w='100%' />
					<Stack w='100%'>
						<Button
							w='100%' variant='ghost' display='flex' justifyContent='space-between'
							as={Link} to='/'
							disabled={path === '/'}
						>
							Exams <FaHouse/>
						</Button>
						<Button
							w='100%' variant='ghost' display='flex' justifyContent='space-between'
							as={Link} to='/statistics'
							disabled={path.startsWith('/statistics')}
						>
							Statistics <FaClockRotateLeft />
						</Button>
					</Stack>
					<Separator w='100%' />
				</Stack>
				<Button
					w='100%' variant='solid' colorPalette='red' display='flex' justifyContent='space-between'
					as={Link} to={`${config.apiUrl}/auth/logout`}
				>Logout <FaRightFromBracket/></Button>
			</Stack>
			<Stack
				minH='100vh'
				w='82%'
				padding='8px'
				overflowY='auto'
			>
				{children}
			</Stack>
		</Flex>
	)
}
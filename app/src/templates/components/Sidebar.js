import { Link } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard";
import { Button } from "../../components/ui/button";
import { Separator, Stack, Link as CLink, HStack } from "@chakra-ui/react";
import config from "../../config";
import GroupBadge from "../../components/GroupBadge";
import { LuCalendarDays, LuChartArea, LuLogOut, LuUsers } from "react-icons/lu";

export default function Sidebar({ me, ...props }) {

	const path = window.location.pathname;

	return (
		<Stack
			h='100vh'
			minWidth='250px'
			background='bg.subtle'
			padding='8px'
			justifyContent='space-between'
			{...props}
		>
			<Stack w='100%'>
				<ProfileCard w='100%' user={me}/>
				<HStack>
					<Separator flex="1" />
					<GroupBadge flexShrink="0" group="Watcher" />
					<Separator flex="25" />
				</HStack>
				<Stack w='100%'>
					<Button
						w='100%' variant='ghost' display='flex' justifyContent='space-between'
						as={Link} to='/'
						disabled={path === '/'}
					>
						Exams <LuCalendarDays/>
					</Button>
					<Button
						w='100%' variant='ghost' display='flex' justifyContent='space-between'
						as={Link} to='/statistics'
						disabled={path.startsWith('/statistics')}
					>
						Statistics <LuChartArea />
					</Button>
				</Stack>
				{ me.is_staff && 
					<>
						<HStack>
							<Separator flex="1" />
							<GroupBadge flexShrink="0" group="Staff" />
							<Separator flex="25" />
						</HStack>
						<Stack w='100%'>
							<Button
								w='100%' variant='ghost' display='flex' justifyContent='space-between'
								as={Link} to='/users'
								disabled={path.startsWith('/users')}
							>
								Users <LuUsers/>
							</Button>
						</Stack>
					</>
				}
			</Stack>
			<Stack w='100%' alignItems='center'>
				<Button
					w='100%' variant='solid' colorPalette='red' display='flex' justifyContent='space-between'
					as='a' href={`${config.apiUrl}/auth/logout`}
				>Logout <LuLogOut/></Button>
				<CLink fontSize='xs' variant="underline" href="https://github.com/UnRenardQuiDab/intraWatchers">
					GitHub Repository
				</CLink>
			</Stack>
		</Stack>
	);
}
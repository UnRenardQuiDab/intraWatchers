import { Button, Drawer, Portal, Tabs } from "@chakra-ui/react";
import ProfileCard from "./ProfileCard";
import { LuCalendar, LuLogs, LuSettings } from "react-icons/lu";
import UserExamStats from "./UserExamStats";
import UserLogs from "./UserLogs";
export default function UserDrawer({ user, children }) {

	return <Drawer.Root size='md'>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
             <ProfileCard user={user} />
            </Drawer.Header>
            <Drawer.Body>
				<Tabs.Root defaultValue="exams" height='100%' variant='subtle' display='flex' flexDirection='column'>
					<Tabs.List>
						<Tabs.Trigger value="exams">
							<LuCalendar />
							Exams
						</Tabs.Trigger>
						<Tabs.Trigger value="logs">
							<LuLogs />
							Logs
						</Tabs.Trigger>
						<Tabs.Trigger value="settings">
							<LuSettings />
							Settings
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="exams">
						<UserExamStats user={user}/>
					</Tabs.Content>
					<Tabs.Content value="logs" flexGrow={1}>
						<UserLogs user={user}/>
					</Tabs.Content>
					<Tabs.Content value="settings">
							Settings
					</Tabs.Content>
				</Tabs.Root>
            </Drawer.Body>
            <Drawer.Footer>
				<Drawer.CloseTrigger asChild>
					<Button variant="outline">Close</Button>
				</Drawer.CloseTrigger>
            </Drawer.Footer>
			<Drawer.CloseTrigger />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
}
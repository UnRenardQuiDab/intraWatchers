import { DrawerBody, Flex, Heading, Text } from "@chakra-ui/react";
import { DrawerActionTrigger, DrawerBackdrop, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle } from "./ui/drawer";
import ExamStatus from "./ExamStatus";
import { useState } from "react";
import { toaster } from "./ui/toaster";
import UserSearchInput from "./UserSearchInput";
import ProfileCard from "./ProfileCard";
import ExamSlot from "./ExamSlot";
import { Button } from "./ui/button";
import ConfirmDialog from "./ConfirmDialog";
import ExamsLogs from "./ExamsLogs";
import { LuArchive, LuCalendar, LuPlus, LuTrash2, LuX } from "react-icons/lu";

export default function ExamDrawer({isAdmin, open, setOpen, exam}) {
	const [loading, setLoading] = useState(false);

	const deleteExam = async () => {
		setLoading(true);
		const res = await exam.delete();
		if (!res.ok) {
			const err = await res.text();
			toaster.create({
				title: err,
				type: 'error',
			})
		}
		else {
			toaster.create({
				title: 'Exam deleted',
				type: 'success',
			})
		}
		setLoading(false);
	}

	const archiveExam = async () => {
		setLoading(true);
		const res = await exam.archive();
		if (!res.ok) {
			const err = await res.text();
			toaster.create({
				title: err,
				type: 'error',
			})
		}
		else {
			toaster.create({
				title: 'Exam archived',
				type: 'success',
			})
		}
		setLoading(false);
	}

	const unregisterWatcher = async (watcher) => {
		setLoading(true);
		const res = await watcher.unregister();
		if (!res.ok) {
			const err = await res.text();
			toaster.create({
				title: err,
				type: 'error',
			})
		}
		else {
			toaster.create({
				title: 'Watcher removed',
				type: 'success',
			})
		}
		setLoading(false);
	}

	const registerWatcher = async (login) => {
		setLoading(true);
		const res = await exam.addWatcher(login);
		if (!res.ok) {
			const err = await res.text();
			toaster.create({
				title: err,
				type: 'error',
			})
		}
		else {
			toaster.create({
				title: 'Watcher added',
				type: 'success',
			})
		}
		setLoading(false);
	}

	return (
	<DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} size='md'>
      <DrawerBackdrop />
      <DrawerContent minW='25vw'>
        <DrawerHeader>
          	<DrawerTitle display='flex' flexDir='column' w='80%'>
				<Flex alignItems='center' w='100%' justifyContent='space-between'>
					<Flex alignItems='center' gap='4px'>
						<LuCalendar/> {exam.start_at.toLocaleDateString('fr-FR')}
						<ExamStatus exam={exam} ml='8px'/>
					</Flex>
					{ exam.title && <Text fontSize='sm' color='text.subtle'>{exam.title}</Text>}
				</Flex>
				<Text color='fg.muted' fontSize='xs'>
					{new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(exam.start_at) + ' ' + exam.start_at.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) + ' - ' + exam.end_at.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
				</Text>
			</DrawerTitle>
        </DrawerHeader>
        <DrawerBody gap='8px' display='flex' flexDir='column'>
			{ isAdmin &&
				<>
				<Flex gap='8px' alignItems='center' paddingBottom='8px'>
					<Heading size='md'>Watchers</Heading>
					<Text color='fg.muted' fontSize='sm'>{exam.watchers.length}/{exam.nb_slots}</Text>
				</Flex>
				{exam.watchers.map((watcher) => (
					<ProfileCard key={watcher.login} user={watcher}>
						<Button
							colorPalette='red' size='sm' w='100%' mt='8px'
							onClick={() => unregisterWatcher(watcher)}
							variant='subtle'
							><LuX/> Remove</Button>
					</ProfileCard>
				))}
				{
					exam.nb_slots - exam.watchers.length > 0 && new Array(exam.nb_slots - exam.watchers.length).fill(0).map((_, i) => (
						<ExamSlot key={i} disabled/>
					))
				}
				{
					exam.watchers.length < exam.nb_slots &&
					<UserSearchInput
					onValid={registerWatcher}
					>
						<Button variant="outline" size="sm">
							<LuPlus/> Add a watcher
						</Button>
					</UserSearchInput>
				}
				</>
			}
			<ExamsLogs exam={exam} mt='16px'/>
        </DrawerBody>
        <DrawerFooter>
			{
				isAdmin && exam.end_at < new Date() && !exam.is_archived &&
				<ConfirmDialog
				text={`Are you sure you want to archive this exam (${exam.start_at.toLocaleDateString('fr-FR')})? This action cannot be undone.`}
					onConfirm={archiveExam}
					confirmColor='green'
				>
					<Button
						loading={loading}
						colorPalette='green'
					>
						<LuArchive/> Archive
					</Button>
				</ConfirmDialog>
			}
			{
				isAdmin && !exam.is_archived &&
				<ConfirmDialog
					text={`Are you sure you want to delete this exam (${exam.start_at.toLocaleDateString('fr-FR')})? This action cannot be undone.`}
					onConfirm={deleteExam}
					confirmColor='red'
				>
					<Button colorPalette="red" loading={loading} >
						<LuTrash2/> Delete
					</Button>
				</ConfirmDialog>
			}
          <DrawerActionTrigger asChild>
            <Button variant="outline">Close</Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>)
}
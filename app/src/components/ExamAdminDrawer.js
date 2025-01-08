import { Button, DrawerBody, Flex, Heading, Text } from "@chakra-ui/react";
import { DrawerActionTrigger, DrawerBackdrop, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle } from "./ui/drawer";
import { FaBoxArchive, FaCalendar, FaPlus, FaTrashCan, FaXmark } from "react-icons/fa6";
import ExamStatus from "./ExamStatus";
import { useState } from "react";
import { toaster } from "./ui/toaster";
import UserSearchInput from "./UserSearchInput";
import ProfileCard from "./ProfileCard";
import ExamSlot from "./ExamSlot";

export default function ExamAdminDrawer({open, setOpen, exam}) {
	const [isLoading, setIsLoading] = useState(false);

	const deleteExam = async () => {
		setIsLoading(true);
		const res = await exam.remove();
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
		setIsLoading(false);
	}

	const archiveExam = async () => {
		setIsLoading(true);
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
		setIsLoading(false);
	}

	const unregisterWatcher = async (watcher) => {
		setIsLoading(true);
		const res = await watcher.remove();
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
		setIsLoading(false);
	}

	const registerWatcher = async (login) => {
		setIsLoading(true);
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
		setIsLoading(false);
	}

	return (
	<DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DrawerBackdrop />
      <DrawerContent minW='25vw'>
        <DrawerHeader>
          	<DrawerTitle display='flex' flexDir='column' w='80%'>
				<Flex alignItems='center' w='100%' justifyContent='space-between'>
					<Flex alignItems='center' gap='4px'>
						<FaCalendar/> {exam.start_at.toLocaleDateString('fr-FR')}
						<ExamStatus exam={exam} ml='8px'/>
					</Flex>
					{ exam.title && <Text fontSize='sm' color='text.subtle'>{exam.title}</Text>}
				</Flex>
				<Text color='fg.muted' fontSize='xs'>
					{exam.start_at.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) + ' - ' + exam.end_at.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
				</Text>
			</DrawerTitle>
        </DrawerHeader>
        <DrawerBody gap='8px' display='flex' flexDir='column'>
    
			<Flex gap='8px' alignItems='center' paddingBottom='8px'>
				<Heading size='md'>Watchers</Heading>
				<Text color='fg.muted' fontSize='sm'>{exam.watchers.length}/{exam.nb_slots}</Text>
			</Flex>
			{exam.watchers.map((watcher) => (
				<ProfileCard key={watcher.login} user={watcher}>
					<Button
						colorPalette='red' size='sm' w='100%' mt='8px'
						onClick={() => unregisterWatcher(watcher)}
					><FaXmark/> Remove</Button>
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
						<FaPlus/> Add a watcher
					</Button>
				</UserSearchInput>
			}
        </DrawerBody>
        <DrawerFooter>
			{
				exam.end_at < new Date() &&
				<Button
					loading={isLoading ? 'true' : undefined}
					colorPalette='green'
					onClick={archiveExam}
				>
					<FaBoxArchive/> Archived
				</Button>
			}
          	<Button
				colorPalette="red"
				loading={isLoading ? 'true' : undefined}
				onClick={deleteExam}
			>
				<FaTrashCan/> Delete
			</Button>
          <DrawerActionTrigger asChild>
            <Button variant="outline">Close</Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>)
}
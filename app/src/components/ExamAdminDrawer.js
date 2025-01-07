import { Button, DrawerBody, Flex, Text } from "@chakra-ui/react";
import { DrawerActionTrigger, DrawerBackdrop, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle } from "./ui/drawer";
import { FaBoxArchive, FaCalendar, FaTrashCan } from "react-icons/fa6";
import ExamStatus from "./ExamStatus";
import { useState } from "react";
import { toaster } from "./ui/toaster";

export default function ExamAdminDrawer({open, setOpen, exam}) {

	const [loading, setLoading] = useState(false);

	const deleteExam = async () => {
		setLoading(true);
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
        <DrawerBody>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </DrawerBody>
        <DrawerFooter>
			{
				exam.end_at < new Date() &&
				<Button
					loading={loading}
					colorPalette='green'
					onClick={archiveExam}
				>
					<FaBoxArchive/> Archived
				</Button>
			}
          	<Button
				colorPalette="red"
				loading={loading}
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
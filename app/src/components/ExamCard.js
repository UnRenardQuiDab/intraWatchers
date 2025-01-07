import { Card, Flex, Grid, Text } from "@chakra-ui/react";
import { FaCalendar } from "react-icons/fa6";
import ExamSlot from "./ExamSlot";
import GroupBadge from "./GroupBadge";
import { useMe } from "../context/useMe";
import { Alert } from "./ui/alert";

export default function ExamCard({ exam, ...props }) {

	const { me } = useMe();

	const IAmWatcher = me && exam && exam.watchers.find((watcher) => watcher._id === me._id);
	const ICanWatch = me && exam && (exam.authorized_groups.find((group) => me.groups.includes(group)) || exam.watchers.find(w => w._id === me._id ) || me.is_staff);

	return (
		<Card.Root w='100%' {...props} borderColor={IAmWatcher && 'border.info'}>
			<Card.Header>
				<Card.Title display='flex' alignItems='center' justifyContent='space-between' gap='4px'>
					<Flex alignItems='center' gap='4px'>
						<FaCalendar/> {exam.start_at.toLocaleDateString('fr-FR')}
					</Flex>
					{ exam.title && <Text fontSize='sm' color='text.subtle'>{exam.title}</Text>}
				</Card.Title>
				<Card.Description>
					{exam.start_at.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) + ' - ' + exam.end_at.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
				</Card.Description>
			</Card.Header>
			<Card.Body gap='8px'>
				<Grid templateColumns="repeat(2, 1fr)" gap='8px'>
					{exam.watchers.map((watcher) => (
						<ExamSlot key={watcher._id+exam._id} watcher={watcher} exam={exam}/>
					))}
					{ exam.watchers.length < exam.nb_slots && <ExamSlot disabled={IAmWatcher || !ICanWatch} exam={exam} />}
					{
						exam.nb_slots - exam.watchers.length - 1 > 0 && new Array(exam.nb_slots - exam.watchers.length - 1).fill(0).map((_, i) => (
							<ExamSlot key={i} disabled/>
						))
					}
				</Grid>
				{ !ICanWatch &&
					<Alert
						status="warning"
						title="You are not authorized to watch this exam"
					/>
				}
			</Card.Body>
			<Card.Footer>
			<Flex
				gap='8px'
			>
				{exam.authorized_groups.map((group) => (
					<GroupBadge key={group._id+exam._id} group={group}/>
				))}
			</Flex>
			</Card.Footer>
		</Card.Root>
	);
}
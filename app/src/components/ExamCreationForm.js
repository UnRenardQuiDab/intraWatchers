import { createListCollection, DialogCloseTrigger, Fieldset, Flex, Input, SelectLabel, SelectRoot } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "./ui/dialog";
import { FaPlus } from "react-icons/fa6";
import { Field } from "./ui/field";
import { NumberInputField, NumberInputRoot } from "./ui/number-input";
import { SelectContent, SelectItem, SelectTrigger, SelectValueText } from "./ui/select";
import GroupBadge from "./GroupBadge";
import { useState } from "react";
import { toaster } from "./ui/toaster";

const groups = createListCollection({
	items: [
	  { label: "Watcher", value: "Watcher" },
	  { label: "Tutor", value: "Tutor" },
	  { label: "LifeGuard", value: "LifeGuard" },
	],
})

export default function ExamCreationForm({onCreate}) {

	const [exam, setExam] = useState({
		start_at: '',
		duration: 3,
		nb_slots: 2,
		authorized_groups: [],
		title: '',
	});

	const isFormValid = exam.start_at && exam.duration && exam.nb_slots;

	const [loading, setLoading] = useState(false);
	const createExam = async () => {
		setLoading(true);
		const res = await onCreate(exam);
		if (!res.ok) {
			const err = await res.text();
			toaster.create({
				title: err,
				type: 'error',
			})
		}
		else {
			toaster.create({
				title: 'Exam created',
				type: 'success',
			})
			exam.start_at = '';
			exam.duration = 3;
			exam.nb_slots = 2;
			exam.authorized_groups = [];
			exam.title = '';
			setOpen(false);
		}
		setLoading(false);
	};

	const [open, setOpen] = useState(false);

  	return (
	<DialogRoot lazyMount placement='center' open={open} onOpenChange={(e) => setOpen(e.open)}>
		<DialogTrigger asChild>
			<Button
				position='fixed'
				bottom='32px'
				right='32px'
			>
				<FaPlus/> Create Exam
			</Button>
		</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Exam</DialogTitle>
        </DialogHeader>
        <DialogBody>
			<Fieldset.Root size="lg" maxW="md">
				<Fieldset.Content>
					<Field label="Date" required>
						<Input type="datetime-local" value={exam.start_at} onChange={(e) => setExam({...exam, start_at: e.target.value})}/>
					</Field>

					<Flex w="100%" justifyContent='space-between' gap='8px'>
						<Field label="Durations" required>
							<NumberInputRoot
								value={exam.duration}
								onValueChange={(e) => setExam({...exam, duration: e.value.substring(0, e.value.length - 3)})}
								w='100%'
								min={1}
								max={24}
								defaultValue="3"
								formatOptions={{
									style: "unit",
									unit: "hour"
								}}
							>
								<NumberInputField />
							</NumberInputRoot>
						</Field>

						<Field label="Slots" required>
							<NumberInputRoot
								defaultValue="2" min={1} w='100%'
								value={exam.nb_slots}
								onValueChange={(e) => setExam({...exam, nb_slots: e.value})}
							>
								<NumberInputField />
							</NumberInputRoot>
						</Field>

					</Flex>
					<SelectRoot multiple collection={groups} width="100%" onValueChange={(e) => setExam({...exam, authorized_groups: e.value})}>
						<SelectLabel>Select Authorized Groups</SelectLabel>
						<SelectTrigger clearable>
							<SelectValueText placeholder="Groups"/>
						</SelectTrigger>
						<SelectContent>
							{groups.items.map((group) => (
								<SelectItem item={group} key={group.value}>
									<GroupBadge group={group.label}/>
								</SelectItem>
							))}
						</SelectContent>
					</SelectRoot>
		
					<Field label="Title">
						<Input value={exam.title} onChange={(e) => setExam({...exam, title: e.target.value})}/>
					</Field>

				</Fieldset.Content>
			</Fieldset.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button disabled={!isFormValid} loading={loading} onClick={createExam}>Create</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
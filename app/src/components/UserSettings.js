import { createListCollection, HStack, Stack, Text } from "@chakra-ui/react";
import GroupBadge from "./GroupBadge";
import { useEffect, useState } from "react";
import { LuSave, LuShield } from "react-icons/lu";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "./ui/select";
import { toaster } from "./ui/toaster";
import { Button } from "./ui/button";
import { useMe } from "context/useMe";
import ConfirmDialog from "./ConfirmDialog";
import { Tooltip } from "./ui/tooltip";


export default function UserSettings({ user }) {

	const groups = createListCollection({
		items: [
		  { label: "Watcher", value: "Watcher" },
		  { label: "Tutor", value: "Tutor" },
		  { label: "LifeGuard", value: "LifeGuard" },
		],
	})

	const { me } = useMe();
	const [groupsSetting, setGroupsSetting] = useState(user.groups ?? []);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user.groups)
			setGroupsSetting(user.groups);
		else
			setGroupsSetting([]);
	}, [user]);

	const handleGroupsSave = async () => {
		setLoading(true);
		const res = await user.update({
			groups: groupsSetting,
		})
		if (!res)
			toaster.create({
				title: 'Error while saving groups',
				type: 'error',
			})
		setLoading(false);
	}

	const handlePermissionChange = async () => {
		setLoading(true);
		const res = await user.update({
			is_staff: !user.is_staff,
		})
		if (!res)
			toaster.create({
				title: 'Error while changing permission',
				type: 'error',
			})
		setLoading(false);
	}

	const saveGroupsDisabled = groupsSetting.length === user.groups.length && groupsSetting.every((group) => user.groups.includes(group));

	return <Stack gap='8'>
		<SelectRoot
			multiple
			collection={groups}
			width="100%"
			onValueChange={(e) => setGroupsSetting(e.value)}
			value={groupsSetting}
		>
			<SelectLabel>Select user groups</SelectLabel>
			<HStack
				width={'full'}
			>
				<SelectTrigger clearable flex='1'>
					<SelectValueText placeholder="Groups"/>
				</SelectTrigger>
				<Button
					disabled={saveGroupsDisabled}
					loading={loading}
					onClick={handleGroupsSave}
				>
					<LuSave /> Save
				</Button>
			</HStack>
			<SelectContent>
				{groups.items.map((group) => (
					<SelectItem item={group} key={group.value}>
						<GroupBadge group={group.label}/>
					</SelectItem>
				))}
			</SelectContent>
		</SelectRoot>
		<Stack>
			<Tooltip
				disabled={me._id !== user._id}
				openDelay={200}
				content={`You can't change your own permissions`}
			>
				<Text fontSize="sm" fontWeight="medium">
					Change permissions for this user
				</Text>
			</Tooltip>
			<ConfirmDialog
				text={`Are you sure you want to ${user.is_staff ? 'remove' : 'add'} staff permission for ${user.login} ?`}
				confirmColor='red'
				onConfirm={handlePermissionChange}
			>
					<Button
						colorPalette='red'
						loading={loading}
						disabled={me._id === user._id}
					>
						<LuShield/> {user.is_staff ? 'Remove staff permission' : 'Add staff permission'}
					</Button>
			</ConfirmDialog>
		</Stack>

	</Stack>
}
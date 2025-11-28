import { Center, defineStyle } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { useMe } from "../context/useMe";
import { useState } from "react";
import { Button } from "./ui/button";
import { toaster } from "./ui/toaster";
import { LuEllipsis, LuPlus, LuX } from "react-icons/lu";

const NEWBIE_COUNT = Number(process.env.REACT_APP_NEWBIE_COUNT) || 1;

export default function ExamSlot({ watcher, exam, disabled }) {

	const { me } = useMe();
	const [hover, setIsHover] = useState(false);
	const IAmWatcher = watcher && me && watcher._id === me._id;
	const [isLoading, setIsLoading] = useState(false);

	const register = async (e) => {
		e.stopPropagation();
		setIsLoading(true);
		const res = await exam.register();
		if (!res.ok) {
			const err = await res.text();
			toaster.create({
                title: err,
                type: 'error',
            })
		}
		setIsLoading(false);
	};

	const unregister = async (e) => {
		e.stopPropagation();
		setIsLoading(true);
		const res = await exam.unregister();
		if (!res.ok) {
			const err = await res.text();
			toaster.create({
                title: err,
                type: 'error',
            })
		}
		setIsLoading(false);
	}

	const ringCss = defineStyle({
		outlineWidth: "2px",
		outlineColor: "colorPalette.500",
		outlineOffset: "2px",
		outlineStyle: "solid",
	})

	if (disabled) {
		return (
		<Button minHeight='40px' width='100%' disabled variant='outline'>
			<LuEllipsis/>
		</Button>
	)}

	if (watcher && IAmWatcher) {
		return (
			<Button minHeight='40px' width='100%' colorPalette='blue' _hover={{ colorPalette: "red" }} onClick={unregister} loading={isLoading}
				onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}
			>
				{
					!hover ?
					<>
						<Avatar size='2xs' name={watcher.login} src={watcher.image_url} css={watcher.nb_watch < NEWBIE_COUNT && ringCss} colorPalette='blue' />
						{watcher.login}
					</>
					:
					<>
						<LuX/> Unregister
					</>
				}
			</Button>
		)
	}
	if (watcher) {
		return (
			<Center minHeight='40px' width='100%' borderRadius='sm' gap='8px' bg={IAmWatcher ? 'bg.info' : 'bg.emphasized'}>
				<Avatar size='2xs' name={watcher.login} src={watcher.image_url} css={watcher.nb_watch < NEWBIE_COUNT && ringCss} colorPalette='blue' />
				{watcher.login}
			</Center>
		)
	}
	return (
		<Button minHeight='40px' width='100%' variant='outline' onClick={register} loading={isLoading}>
			<LuPlus/> Register
		</Button>
	)
}

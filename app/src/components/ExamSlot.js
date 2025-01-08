import { Center, defineStyle } from "@chakra-ui/react";
import { FaEllipsis, FaPlus, FaXmark } from "react-icons/fa6";
import { Avatar } from "./ui/avatar";
import { useMe } from "../context/useMe";
import { useState } from "react";
import { Button } from "./ui/button";
import { toaster } from "./ui/toaster";

export default function ExamSlot({ watcher, exam, disabled, ...props }) {

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
			<FaEllipsis/>
		</Button>
	)}

	if (watcher && IAmWatcher && (hover || isLoading)) {
		return (
			<Button minHeight='40px' width='100%' colorPalette='red' onMouseLeave={() => setIsHover(false)} onClick={unregister} loading={isLoading}>
				<FaXmark/> Unregister
			</Button>
		)
	}
	if (watcher) {
		return (
			<Center minHeight='40px' width='100%' borderRadius='sm' gap='8px' bg={IAmWatcher ? 'bg.info' : 'bg.emphasized'} onMouseEnter={() => setIsHover(true)}>
				<Avatar size='2xs' name={watcher.login} src={watcher.image_url} css={watcher.nb_watch === 0 && ringCss} colorPalette='blue' />
				{watcher.login}
			</Center>
		)
	}
	return (
		<Button minHeight='40px' width='100%' variant='outline' onClick={register} loading={isLoading}>
			<FaPlus/> Register
		</Button>
	)
}

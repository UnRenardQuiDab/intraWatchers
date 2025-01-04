import { Button, Center, Skeleton } from "@chakra-ui/react";
import { FaEllipsis, FaPlus, FaXmark } from "react-icons/fa6";

export default function ExamSlot({ user, disabled, ...props }) {
	if (disabled) {
		return (
		<Button minHeight='40px' width='100%' disabled variant='subtle'>
			<FaEllipsis/>
		</Button>
	)}
	return (
		<Button minHeight='40px' width='100%' variant='outline'>
			<FaPlus/> Register
		</Button>
	)
}

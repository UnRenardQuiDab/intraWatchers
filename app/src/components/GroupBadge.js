import { Badge } from "@chakra-ui/react";

export default function GroupBadge({ group }) {
	return (
		<Badge key={group} colorPalette={group === 'Tutor' ? 'yellow' : 'purple' }>{group}</Badge>
	)
}
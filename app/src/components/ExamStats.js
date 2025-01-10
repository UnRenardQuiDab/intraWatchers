import { Card, Text } from "@chakra-ui/react";
import { ProgressBar, ProgressRoot } from "./ui/progress";
import { StatLabel, StatRoot, StatValueText } from "./ui/stat";

export default function ExamStats({ label, value, needed, colorPalette }) {
	return (
		<Card.Root>
      	<Card.Body>
			<StatRoot colorPalette={value >= needed ? 'green' : ''}>
			<StatLabel>{ label }</StatLabel>
			<StatValueText color={colorPalette ? colorPalette : '' }>
				{value}
				{ needed ?
					<Text fontWeight='normal'> / {needed}</Text>
					: ''
				}
			</StatValueText>
			{needed &&
				<ProgressRoot value={value / needed * 100}>
					<ProgressBar />
				</ProgressRoot>
			}
			</StatRoot>
		</Card.Body>
		</Card.Root>
	  )
	
}
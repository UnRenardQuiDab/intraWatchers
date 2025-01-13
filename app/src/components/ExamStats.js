import { Card, Text } from "@chakra-ui/react";
import { ProgressBar, ProgressRoot } from "./ui/progress";
import { StatLabel, StatRoot, StatValueText } from "./ui/stat";

export default function ExamStats({ label, value, needed, colorPalette, ...props }) {
	return (
		<Card.Root {...props} h='100%' w='100%'>
      	<Card.Body>
			<StatRoot colorPalette={value >= needed ? 'green' : ''} >
				<StatLabel>{ label }</StatLabel>
				<StatValueText color={colorPalette ? colorPalette : '' }>
					{Number.isInteger(value) && needed ? Math.min(value, needed) : value}
					{ needed ?
						<Text fontWeight='normal'> / {needed}</Text>
						: ''
					}
				</StatValueText>
				{needed &&
					<ProgressRoot value={Math.min(value, needed) / needed * 100} colorPalette={value >= needed ? 'green' : ''}>
						<ProgressBar />
					</ProgressRoot>
				}
			</StatRoot>
		</Card.Body>
		</Card.Root>
	  )
	
}
import { Card, HStack, Table } from "@chakra-ui/react";
import { PaginationNextTrigger, PaginationPageText, PaginationPrevTrigger, PaginationRoot } from "./ui/pagination";

export default function LeaderBoard({...props}) {

	const items = [
		{ id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
		{ id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
		{ id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
		{ id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
		{ id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
	]

	return (
		<Card.Root {...props}>
			<Card.Body gap="2">
				<Card.Title mt="2">LeaderBoard</Card.Title>
				<Table.Root size='md'>
					<Table.Header>
						<Table.Row bg='transparent'>
							<Table.ColumnHeader>Login</Table.ColumnHeader>
							<Table.ColumnHeader>Amount of watch</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">Last Watch</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{items.map((item) => (
							<Table.Row key={item.id}>
								<Table.Cell>{item.name}</Table.Cell>
								<Table.Cell>{item.category}</Table.Cell>
								<Table.Cell textAlign="end">{item.price}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
			</Table.Root>
			</Card.Body>
			<Card.Footer>
				<PaginationRoot count={20} pageSize={2} defaultPage={1}>
					<HStack gap="4">
						<PaginationPrevTrigger />
						<PaginationPageText />
						<PaginationNextTrigger />
					</HStack>
				</PaginationRoot>
			</Card.Footer>
		</Card.Root>
	)
}
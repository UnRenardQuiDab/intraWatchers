import ExamMonthSection from "../components/ExamMonthSection";
import { useEffect, useRef, useState } from "react";
import ExamCreationForm from "../components/ExamCreationForm";
import { useMe } from "../context/useMe";
import LeftNavTemplate from "../templates/LeftNavTemplate";
import { EmptyState } from "../components/ui/empty-state";
import { Center, ActionBar, Portal, HStack } from "@chakra-ui/react";
import { LuHistory, LuRefreshCcw, LuShieldAlert } from "react-icons/lu";
import useExams from "hooks/useExams";
import { Button } from "components/ui/button";
import { PaginationNextTrigger, PaginationPageText, PaginationPrevTrigger, PaginationRoot } from "components/ui/pagination";

export default function Exams() {

	const { me } = useMe();

	const pageSize = 20;

	
	const archivedOptions = useRef({
		sort: '-start_at',
		pageSize,
		filter: {
			is_archived: true,
		},
	});
	const currentOptions = useRef({
		sort: 'start_at',
		pageSize,
		filter: {
			is_archived: false,
		},
	});
	
	const [mode, setMode] = useState(currentOptions);

	const { exams, create, currentPage, pageCount, setPage } = useExams(mode.current)


	const splitExams = (exams) => {
		let months = [];
		exams.forEach(exam => {
			const month = new Date(exam.start_at).toLocaleString('default', { month: 'long' });
			const year = new Date(exam.start_at).getFullYear();
			if (months.find((m) => m.month === month && m.year === year))
				return;
			months.push({month, year});
		})
		return months;
	}
	
	
	const [months, setMonths] = useState([]);
	useEffect(() => {
		setMonths(splitExams([...exams]));
	}, [exams]);
	
	if (months && me)
	return (
		<LeftNavTemplate me={me} gap='32px' pb='128px' alignItems='center'>
			{months.map((date) => (
				<ExamMonthSection
					w='100%'
					key={date.month + date.year} year={date.year} month={date.month} exams={
						[...exams].filter(exam =>
							new Date(exam.start_at).toLocaleString('default', { month: 'long' }) === date.month &&
							new Date(exam.start_at).getFullYear() === date.year
						)
					}
				/>
			))}
			{ months.length === 0 &&
				<Center
					h='100%'
					w='100%'
				>
					<EmptyState
						icon={<LuShieldAlert />}
						title="No exams planned"
						description="It seems there are no exams planned for the moment. Check back later or contact an administrator if you think that's an issue."
					/>
				</Center>
			}
			<ActionBar.Root open={me.is_staff}>
				<Portal>
					<ActionBar.Positioner>
						<ActionBar.Content>
							<PaginationRoot
								count={pageCount * pageSize}
								pageSize={pageSize}
								page={currentPage}
								onPageChange={(e) => setPage(e.page)}
							>
								<HStack wrap="wrap">
									<PaginationPrevTrigger />
									<PaginationPageText />
									<PaginationNextTrigger />
								</HStack>
							</PaginationRoot>
							<ActionBar.Separator />
							<Button variant="outline" size="sm" colorPalette='blue' onClick={() => setMode(mode === archivedOptions ? currentOptions : archivedOptions)}>
								{ mode === currentOptions ?
								<>
									<LuHistory />
									Show history
								</> :
								<>
									<LuRefreshCcw />
									Show current
								</>}
							</Button>
							<ExamCreationForm size='sm' onCreate={create} />
						</ActionBar.Content>
					</ActionBar.Positioner>
				</Portal>
			</ActionBar.Root>
		</LeftNavTemplate>
	);
}

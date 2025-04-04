import Exam from "classes/Exam";
import config from "../config";
import { useCallback, useEffect, useState } from "react";

export default function useExams({filter = {}, sort = '-start_at', pageSize = 10, page = 1} = {}) {

	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(page);

	const updateExam = useCallback((updatedExam) => {
		setExams((prevExams) => prevExams.map((exam) => (exam._id === updatedExam._id ? updatedExam : exam)).filter((exam) => {
			for (const key in filter) {
				if (exam[key] !== filter[key]) return false;
			}
			return true;
		}));
	}, [filter])

	const deleteExam = useCallback((examId) => {
		setExams((prevExams) => prevExams.filter((exam) => exam._id !== examId));
	}, [])

	const fetchExams = async () => {
		setLoading(true);
		const queryOptions = {sort, page: currentPage, page_size: pageSize};
		for (const key in filter) {
			queryOptions[`filter[${key}]`] = filter[key];
		}
		const response = await fetch(`${config.apiUrl}/exams?${new URLSearchParams(queryOptions).toString()}`, {
			credentials: 'include',
		});

		if (response.ok) {
			setPageCount(parseInt(response.headers.get('X-Page-Count')));
			const data = await response.json();
			setExams(sortExams(data.map(e => new Exam(e, updateExam, deleteExam)), sort));
		}
		setLoading(false);
	}

	const create = async (exam) => {
		const response = await fetch(`${config.apiUrl}/exams`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...exam,
				start_at: new Date(exam.start_at).toISOString(),
			}),
		});
		if (response.ok) {
			fetchExams()
		}
		return response;
	};

	useEffect(() => {
		fetchExams();
		// eslint-disable-next-line
	}, [currentPage]);

	useEffect(() => {
		if (currentPage === 1) {
			fetchExams();
		}
		else {
			setCurrentPage(1);
		}
		// eslint-disable-next-line
	}, [filter, sort, pageSize]);

	const setPage = (page) => {
		setCurrentPage(page);
	}

	
	return { exams, create, loading, setPage, currentPage, pageCount };
}


function sortExams(exams, sort) {
	const sorts = sort.split(' ').map(s => {
		return {
			field: s.replace('-', ''),
			order: s.startsWith('-') ? -1 : 1
		};
	});

	return exams.sort((a, b) => {
		for (const { field, order } of sorts) {
			if (a[field] < b[field])
				return -1 * order;
			if (a[field] > b[field])
				return 1 * order;
		}
		return 0;
	});
}

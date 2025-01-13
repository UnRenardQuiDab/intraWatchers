import config from "../config";
import { useEffect, useState } from "react";

export default function useUsers(sort = 'login', defaultPage = 1, pageSize = 10, orderBy = 1) {
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(defaultPage);
	const [nbPages, setNbPages] = useState(0);

	useEffect(() => {
		fetchUsers();
	}, [page]);

	const fetchUsers = async () => {
		const response = await fetch(`${config.apiUrl}/users?sort=${sort}&page=${page}&pageSize=${pageSize}`,{
			credentials: 'include'
		});
		const data = await response.json();
		if (response.ok)
		{
			setUsers(data);
			setNbPages(response.headers.get('X-Page-Count'));
		}
	}

	const nextPage = () => {
		setPage(page + 1);
	}

	const prevPage = () => {
		setPage(page - 1);
	}

	const setPageNumber = (number) => {
		setPage(number);
	}

	return { users, nextPage, prevPage, setPageNumber, nbPages, page };
}
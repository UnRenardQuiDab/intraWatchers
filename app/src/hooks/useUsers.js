import config from "../config";
import { useEffect, useState } from "react";

export default function useUsers(sort = 'login', defaultPage = 1, pageSize = 10) {
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(defaultPage);
	const [nbPages, setNbPages] = useState(0);

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line
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

	const deleteUser = async (user) => {
		const response = await fetch(`${config.apiUrl}/users/${user.login}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		if (response.ok)
			setUsers((users) => users.filter(u => u._id !== user._id));
	}

	const addUser = async (login) => {
		const response = await fetch(`${config.apiUrl}/users`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({login}),
		});
		if (response.status === 201) {
			const user = await response.json();
			setUsers([...users, user]);
		}
		else {
			const error = await response.text();
			throw new Error(error);
		}
	}

	const userSearch = async (login) => {
		const response = await fetch(`${config.apiUrl}/users?sort=${sort}&page=${page}&pageSize=${pageSize}&login=${login}`,{
			credentials: 'include'
		});
		const data = await response.json();
		if (response.ok)
		{
			setUsers(data);
			setNbPages(response.headers.get('X-Page-Count'));
		}
	}

	const getExams = async (user) => {
		const response = await fetch(`${config.apiUrl}/users/${user.login}/exams`, {
			credentials: 'include'
		});
		const data = await response.json();
		if (response.ok)
			return data.map(e => ({
				...e,
				start_at: new Date(e.start_at),
				end_at: new Date(new Date(e.start_at).setHours(new Date(e.start_at).getHours() + e.duration)),
			}));
	}

	const getLogs = async (user) => {
		const response = await fetch(`${config.apiUrl}/logs?query[user]=${user.login}`, {
			credentials: 'include'
		});
		const data = await response.json();
		if (response.ok)
			return data;
	}

	return { users: users.map(u => ({
			...u,
			delete: () => deleteUser(u),
			getExams: () => getExams(u),
			getLogs: () => getLogs(u),
		})),
		nextPage,
		prevPage,
		addUser,
		setPageNumber,
		userSearch,
		nbPages,
		page
	};
}
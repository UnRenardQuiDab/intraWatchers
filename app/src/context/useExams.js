import { createContext, useContext, useEffect, useState } from "react";
import config from "../config";

const ExamsContext = createContext();

export const ExamsProvider = ({ children }) => {

	const [exams, setExams] = useState([]);

	const fetchExams = async () => {
		const exams = await fetch(`${config.apiUrl}/exams`, {
			credentials: 'include',
		});
		if (exams.ok) {
			setExams(await exams.json());
		}
	};

	const create = async (exam) => {
		const newExam = await fetch(`${config.apiUrl}/exams`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(exam),
		});
		if (newExam.ok) {
			setExams([...exams, await newExam.json()]);
		}
		return newExam;
	};

	const remove = async (examId) => {
		const deleted = await fetch(`${config.apiUrl}/exams/${examId}`, {
			method: 'DELETE',
			credentials: 'include',
		});
		if (deleted.ok) {
			setExams(exams.filter(exam => exam._id !== examId));
		}
		return deleted;
	}

	const resiter = async (examId) => {
		const register = await fetch(`${config.apiUrl}/exams/${examId}/register`, {
			method: 'POST',
			credentials: 'include',
		});
		if (register.ok) {
			const newExam = await register.json();
			setExams(exams.map(exam => {
				if (exam._id === examId) {
					return newExam;
				}
				return exam;
			}));
		}
		return register;
	};

	const unregister = async (examId) => {
		const unregister = await fetch(`${config.apiUrl}/exams/${examId}/unregister`, {
			method: 'POST',
			credentials: 'include',
		});
		if (unregister.ok) {
			const newExam = await unregister.json();
			setExams(exams.map(exam => {
				if (exam._id === examId) {
					return newExam;
				}
				return exam;
			}));
		}
		return unregister;
	};

	const archive = async (examId) => {
		const archived = await fetch(`${config.apiUrl}/exams/${examId}/archived`, {
			method: 'POST',
			credentials: 'include',
		});
		if (archived.ok) {
			setExams(exams.filter(exam => exam._id !== examId));
		}
		return archived;
	}

	useEffect(() => {
		fetchExams();
	}, []);

	return <ExamsContext.Provider value={{
		exams: exams.map(exam => {
			return {
				...exam,
				start_at: new Date(exam.start_at),
				end_at: new Date(new Date(exam.start_at).setHours(new Date(exam.start_at).getHours() + exam.duration)),
				register: () => resiter(exam._id),
				unregister: () => unregister(exam._id),
				archive: () => archive(exam._id),
				remove: () => remove(exam._id),
			};
		}),
		create
	}}>
		{children}
  	</ExamsContext.Provider>;

};


export const useExams = () => {
	return useContext(ExamsContext);
  };
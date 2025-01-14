import { createContext, useContext, useEffect, useState } from "react";
import config from '../config';

const MeContext = createContext();

export const MeProvider = ({ children }) => {
  const [me, setMe] = useState(null);


  const fetchMe = async () => {
    try {
      const user = await fetch(`${config.apiUrl}/me`, {
        credentials: 'include',
      });
      if (user.ok) {
        setMe(await user.json());
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const getMyExams = async () => {
    if (!me) {
      return;
    }
    try {
      const exams = await fetch(`${config.apiUrl}/users/${me.login}/exams`, {
        credentials: 'include',
      });
      if (exams.ok) {
        return await exams.json();
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <MeContext.Provider value={{
      me,
      getMyExams
    }}>
      {children}
    </MeContext.Provider>
  );
};

export const useMe = () => {
  return useContext(MeContext);
};
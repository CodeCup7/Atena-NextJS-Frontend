'use client'
import { updateUserList } from "@/app/factory/factory_user";
import { Role, User } from "@/app/classes/user";
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const idList = [1, 2, 3]
const id = 1;

export const Test = () => {

  const [userList, setUserList] = useState<Array<User>>([]);
  const [user, setUser] = useState(new User());

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await updateUserList();
        setUserList(users);
      } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (userList.length > 1) {
      setUser(userList[1]);
      console.log(userList[1]); // Wyświetli zaktualizowanego użytkownika

    }
  }, [userList]);

  console.log(user != null && user.id != 0 ? user.role : user.role); // Wyświetli zaktualizowanego użytkownika

  return (
    <div>
      <select
        value={user != null && user.id != 0 ? user.role : 'DEFAULT'}
        className="select select-info w-72"
        onChange={e => {
          const selectedRole = Object.values(Role).find(role => role === e.target.value) || Role.SUPERVISOR_;
          setUser({ ...user, role: selectedRole });
        }}
      >
        <option value="DEFAULT" disabled>
          Wybierz rolę ...
        </option>
        {Object.values(Role).map((role, index) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>

  );
};

export default Test;

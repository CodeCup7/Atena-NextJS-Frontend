'use client'

import { Role, User } from "@/app/classes/user";
import { useEffect, useState } from "react";

export const Test = () => {

  const i:number = 1;

  let userEDIT = new User();
  userEDIT.role = Role.BOSS_;

  const [selectedRole, setSelectedRole] = useState('');
  const [user, setUser] = useState(new User());

  useEffect(() => {

    if (i === 0) {
      if (i === 0 && userEDIT.role !== undefined) {
        setSelectedRole(userEDIT.role);
      }
    }

    
  }, []);

  console.log(user.role)

  return (
    <div>
      <select
        className="select select-info w-72 "
        value={selectedRole}
        onChange={e => {
          setSelectedRole(e.target.value)
          setUser({ ...user, role: Object.values(Role).find(role => role === e.target.value) || Role.SUPERVISOR_ });

        }}>
        <option value={''} disabled>Wybierz rolę ...</option>
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

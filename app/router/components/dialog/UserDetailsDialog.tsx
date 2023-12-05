// Komponent ConfirmDialog
import { api_UserList_getByLogin, api_User_add } from '@/app/api/user_api';
import { Role, User } from '@/app/classes/user';
import { global_userList, updateUserList } from '@/app/factory/factory_user';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

interface Prop {
  open: boolean;
  onClose: (isOpen: boolean) => void;
  onEdit: boolean;
  user: User;
  isEditMode: boolean;
}

const UserDetailsDialog: React.FC<Prop> = (props) => {
  useEffect(() => {
    if (props.open) {
      toast.dismiss();
      setUser(new User());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setUser(new User());
    }
  }, [props.open, props.user]);

  const [isAgent, setIsAgent] = useState(false);
  const [userList, setUserList] = useState(global_userList);
  const [user, setUser] = useState(props.user)

  async function action() {

    //Sprawdzenie wypełnienia wszystkich wymaganych pól
    if (user.login != '' && user.nameUser != '' && user.mail != '') {
      if (user.role === Role.AGENT_ && (user.bossId === 0 || user.leaderId === 0 || user.coachId === 0)) {

        toast.error("Nie uzupełniono wszystkich wymaganych pól dla roli agenta", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark"
        });

      } else {

        //Sprawdzenie czy login istnieje w bazie
        api_UserList_getByLogin(user.login)
          .then(dbUser => {
            if (dbUser.login === user.login) {
              toast.error("Login " + user.login + " istnieje już w systemie", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
              });
            } else {
              //Dodanie lub edytowanie usera w DB
              if (props.isEditMode) {

              } else {

                api_User_add(user).then((foo => {
                  if (foo.isOK === true) {
                    toast.info(foo.callback, {
                      position: toast.POSITION.TOP_RIGHT,
                      theme: "dark"
                    });
                  } else {
                    toast.error(foo.callback, {
                      position: toast.POSITION.TOP_RIGHT,
                      theme: "dark"
                    });
                  }
                  updateUserList().then(() => {
                    setUserList(global_userList)
                  }
                  )
                }));
              }

            }
          })
          .catch(error => {
            console.error('Błąd pobierania użytkownika:', error);
          });

      }
    } else {
      toast.error("Nie uzupełniono wszystkich wymaganych pól", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark"
      });
    }
  }

  return (
    <div className={`fixed z-50 top-0 left-0 w-screen h-screen flex items-center justify-center ${props.open ? '' : 'hidden'}`}>
      <ToastContainer />
      <div className='flex flex-col bg-slate-800 border-2 border-info rounded-2xl z-10 inset-0'>
        {/* HEAD */}
        <div className='flex w-full h-8 justify-end'>
          <button onClick={() => props.onClose(false)}
            className='flex btn btn-sm btn-info hover:btn-warning'>X</button>
        </div>
        <div className='flex items-center justify-center'>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-info">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          <h1 className='text-4xl text-info mb-4 ml-2'>
            {props.onEdit ? "Edycja / Podgląd " : "Dodawanie "} Użytkownika</h1>
        </div>
        <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-2 my-7"></hr>

        <div className='flex items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-96 h-96 text-info">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>

          {/* BODY */}
          <div className="flex flex-col w-full items-center justify-center gap-y-4 ">
            <input
              className="input input-bordered input-info max-w-md w-72"
              defaultValue={props.onEdit ? user.login : ''}
              type="text"
              placeholder="Login"
              onChange={e => user.login = e.target.value} />
            <input
              className="input input-bordered input-info max-w-md gap-y-2 w-72"
              defaultValue={props.onEdit ? user.nameUser : ''}
              type="text"
              placeholder="Imię i nazwisko"
              onChange={e => user.nameUser = e.target.value} />
            <select
              defaultValue={props.onEdit ? user.role : 'DEFAULT'}
              className="select select-info w-72 "
              onChange={
                e => {
                  user.role = Object.values(Role).find(role => role === e.target.value) || Role.SUPERVISOR_
                  if (user.role === Role.AGENT_) {
                    setIsAgent(true)
                  } else {
                    setIsAgent(false)
                  }
                }
              }>
              <option value="DEFAULT" disabled>Wybierz rolę ...</option>
              {Object.values(Role).map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
            {/* Jeżlei rola agent to odpal Boss, Coach, Leader */}
            <select
              defaultValue={props.onEdit ? userList.find(coach => coach.id === user.coachId)?.nameUser : 'DEFAULT'}
              className={`select select-info w-72 ${isAgent ? '' : 'hidden'}`}
              onChange={e => user.coachId === parseInt(e.target.value)}>
              <option value="DEFAULT" disabled>Coach ...</option>
              {userList.filter(user => user.role === Role.COACH_).map((user, index) => (
                <option key={index} value={user.id}>{user.nameUser}</option>
              ))}
            </select>
            <select
              defaultValue={props.onEdit ? userList.find(boss => boss.id === user.bossId)?.nameUser : 'DEFAULT'}
              className={`select select-info w-72 ${isAgent ? '' : 'hidden'}`}
              onChange={e => user.bossId === parseInt(e.target.value)}>
              <option value="DEFAULT" disabled>Kierownik ...</option>
              {userList.filter(user => user.role === Role.BOSS_).map((user, index) => (
                <option key={index} value={user.id}>{user.nameUser}</option>
              ))}
            </select>
            <select
              defaultValue={props.onEdit ? userList.find(leader => leader.id === user.leaderId)?.nameUser : 'DEFAULT'}
              className={`select select-info w-72 ${isAgent ? '' : 'hidden'}`}
              onChange={e => user.leaderId === parseInt(e.target.value)}>
              <option value="DEFAULT" disabled>Leader ...</option>
              {userList.filter(user => user.role === Role.LEADER_).map((user, index) => (
                <option key={index} value={user.id}>{user.nameUser}</option>
              ))}
            </select>
            <select
              defaultValue={props.onEdit ? String(user.available) : 'DEFAULT'}
              className="select select-info w-72 "
              onChange={(e) => user.available = e.target.value === "true"}>
              <option value="DEFAULT" disabled>Czy aktywny ...</option>
              <option value="true">TAK</option>
              <option value="false">NIE</option>
            </select>
            <input
              className="input input-bordered input-info max-w-md gap-y-2 w-72"
              defaultValue={props.onEdit ? user.mail : ''}
              type="text"
              placeholder="E-Mail"
              onChange={e => user.mail = e.target.value} />
            <button
              onClick={action}
              className='btn btn-info hover:btn-primary'>{props.onEdit ? "Edytuj" : "Dodaj"}</button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default UserDetailsDialog;

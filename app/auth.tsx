'use client'
import { useEffect } from "react";
import { api_UserList_getByLogin } from "./api/user_api";
import { User } from "./classes/user";

const login = 'Admin';

let activeUser: User = new User();
export function getActiveUser(): User {

    if (activeUser.id !== 0) {
        return activeUser;
    } else {
        try {
            setActiveUser();
        } catch (error) {
            console.error('Błąd pobierania użytkowników:', error);
        }
        return activeUser;
    }
}

async function setActiveUser(): Promise<User> {

    if (activeUser.id !== 0) {
        return activeUser;
    } else {
        try {
            activeUser = await api_UserList_getByLogin(login);
        } catch (error) {
            console.error('Błąd pobierania użytkowników:', error);
        }
        return activeUser;
    }
}
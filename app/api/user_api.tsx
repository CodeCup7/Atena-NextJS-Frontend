// '==========================================================================================================================================
// '*********************** User API *********************************************************************************************************
// '==========================================================================================================================================
import { User } from "../classes/user";

interface Foo {
    callback: string;
    isOK: boolean;
    user: User;
}

export async function api_User_add(user: User): Promise<Foo> {

    try {

        const response = await fetch('http://localhost:8080/api/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            const addedUser = await response.json();
            return { callback: 'Użytkownik został dodany', isOK: true, user: addedUser };
        } else {
            return { callback: 'Użytkownik nie został dodany' + response, isOK: false, user: new User() };
        }
    } catch (error) {
        return { callback: 'Błąd dodawania Użytkownika ' + error, isOK: false, user: new User() };
    }
}

export async function api_UserList_add(userList: []) {

    try {

        const response = await fetch('http://localhost:8080/api/user/addList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userList),
        });

        if (response.ok) {
            const addedUser = await response.json();
            return { callback: 'Użytkownicy zostali dodani', isOK: true, user: addedUser };
        } else {
            return { callback: 'Użytkownicy nie zostali dodani' + response, isOK: false, user: new User() };
        }
    } catch (error) {
        return { callback: 'Błąd dodawania użytkowników ' + error, isOK: false, user: new User() };
    }
}

export async function api_UserList_getAll(): Promise<User[]> {
    try {
        const response = await fetch('http://localhost:8080/api/user/getUserAll');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error during API call:', error);
        return [];
    }
}

export async function api_UserList_getByLogin(login: string): Promise<User> {

    try {

        const response = await fetch('http://localhost:8080/api/user/getUserLogin/' + login);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error during API call:', error);
        return new User();
    }
}

export async function api_UserList_getById(id: number): Promise<User> {

    try {

        const response = await fetch('http://localhost:8080/api/user/getUserId/' + id);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();

    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
        return new User();
    }
}

export async function api_User_update(user: User): Promise<Foo> {

    try {

        const response = await fetch('http://localhost:8080/api/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            return { callback: 'Użytkownik został edytowany', isOK: true, user: new User() };

        } else {
            return { callback: 'Użytkownik nie został edytowany ' + response, isOK: false, user: new User() };
        }
    } catch (error) {
        return { callback: 'Błąd edytowania użytkownika ' + error, isOK: false, user: new User() };
    }
}

export async function api_User_delete(userId: number): Promise<Foo> {
    
    try {

        const response = await fetch('http://localhost:8080/api/user/delete/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return { callback: 'Użytkownik został usunięty', isOK: true, user: new User() };

        } else {
            return { callback: 'Użytkownik nie został usunięty ' + response, isOK: false, user: new User() };
        }
    } catch (error) {
        return { callback: 'Błąd usuwania użytkownika ' + error, isOK: false, user: new User() };
    }
}
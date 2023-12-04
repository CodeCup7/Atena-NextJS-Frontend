
import { User } from "../classes/user";
import { userList_ } from "../factory/factory_user";

export function api_User_add(user: User) {

    fetch('http://localhost:8080/api/user/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Określenie, że dane są w formacie JSON
        },
        body: JSON.stringify(user),
    })
        .then(response => {
            if (response.ok) {
                console.log('User została dodana');
            } else {
                console.log('User nie została dodana ');;
            }

        })
        .catch(error => {
            console.log('Błąd dodawania User ' + error)
        });

}

export function api_UserList_add() {
    fetch('http://localhost:8080/api/user/addList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Określenie, że dane są w formacie JSON
        },
        body: JSON.stringify(userList_),
    })
        .then(response => {
            if (response.ok) {
                console.log('User została dodana');
            } else {
                console.log('User nie została dodana ');;
            }

        })
        .catch(error => {
            console.log('Błąd dodawania User ' + error)
        });
}

export async function api_UserList_getAll(): Promise<User[]> {
    try {
        const response = await fetch('http://localhost:8080/api/user/getUserAll');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
        return [];
    }
}

export async function api_UserList_getByLogin(login:string): Promise<User> {
    try {
        const response = await fetch('http://localhost:8080/api/user/getUserLogin/' + login);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
        return new User;
    }
}

export async function api_UserList_getById(id:number): Promise<User> {
    try {
        const response = await fetch('http://localhost:8080/api/user/getUserId/' + id);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
        return new User;
    }
}

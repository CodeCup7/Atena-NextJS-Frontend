
import { User } from "../classes/user";

interface Foo {
    callback: string;
    isOK: boolean;
}

export async function api_User_add(user: User): Promise<Foo> {
    
    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            foo.callback = 'Użytkownik został dodany';
            foo.isOK = true;
        } else {
            foo.callback = 'Użytkownik nie został dodany';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania Użytkownika ' + error, isOK: false };
    }
}

export async function api_UserList_add(userList: []) {
    fetch('http://localhost:8080/api/user/addList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Określenie, że dane są w formacie JSON
        },
        body: JSON.stringify(userList),
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

export async function api_UserList_getByLogin(login: string): Promise<User> {
    try {
        const response = await fetch('http://localhost:8080/api/user/getUserLogin/' + login);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        return new User;
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
        return new User;
    }
}

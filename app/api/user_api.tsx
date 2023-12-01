
import { User } from "../classes/user";
import { userList_ } from "../factory/factory_user";

export function api_User_add(user:User): string {

    let callback = '';

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
            console.log('Błąd dodawania User ')
        });

    return callback;
}

export function api_UserList_add(): string {
    console.log('sd')
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
            console.log(error + 'Błąd dodawania User ')
        });

    return callback;
}


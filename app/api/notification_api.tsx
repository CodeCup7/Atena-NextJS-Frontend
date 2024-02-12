// '==========================================================================================================================================
// '*********************** Notification API *************************************************************************************************
// '==========================================================================================================================================

import { Notification } from "../classes/notification";
import { User } from "../classes/user";

interface Foo {
    callback: string;
    isOK: boolean;
}

export async function api_Notification_add(notification: Notification): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/notification/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification),
        });

        if (response.ok) {
            foo.callback = 'Powiadomienie zostało dodane';
            foo.isOK = true;
        } else {
            foo.callback = 'Powiadomienie nie zostało dodane';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania powiadomienia ' + error, isOK: false };
    }
}

export async function api_NotificationList_getAll(user: User): Promise<Notification[]> {
    try {
        
        const response = await fetch('http://localhost:8080/api/notification/getAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania Powiadomień:', error);
        return [];
    }
}

export async function api_Notification_update(notification: Notification): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/notification/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification),
        });

        if (response.ok) {
            foo.callback = 'Powiadomienie zostało edytowane';
            foo.isOK = true;
        } else {
            foo.callback = 'Powiadomienie nie zostało edytowane';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd edytowania powiadomienia ' + error, isOK: false };
    }
}

export async function api_User_delete(id: number): Promise<Foo> {
    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/notification/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            foo.callback = 'Powiadomienie zostało usuniętę';
            foo.isOK = true;
        } else {
            foo.callback = 'Powiadomienie nie zostało usuniętę';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd usuwania kolejki ' + error, isOK: false };
    }
}

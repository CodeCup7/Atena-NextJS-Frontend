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
        const response = await fetch('http://localhost:8080/api/notification/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification),
        });
        if (!response.ok) {
            throw new Error('Nieudana próba dodania powiadomienia');
        }
        return { callback: 'Powiadomienie zostało dodane', isOK: true };
    } catch (error) {
        console.error('Błąd dodawania powiadomienia ', error);
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
            throw new Error('Nieudana próba pobrania powiadomień');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania Powiadomień:', error);
        return [];
    }
}
export async function api_Notification_update(notification: Notification): Promise<Foo> {
    try {
        const response = await fetch('http://localhost:8080/api/notification/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification),
        });
        if (!response.ok) {
            throw new Error('Nieudana próba edycji powiadomienia');
        }
        return { callback: 'Powiadomienie zostało edytowane', isOK: true };
    } catch (error) {
        console.error('Błąd edytowania powiadomienia ', error);
        return { callback: 'Błąd edytowania powiadomienia ' + error, isOK: false };
    }
}
export async function api_User_delete(id: number): Promise<Foo> {
    try {
        const response = await fetch('http://localhost:8080/api/notification/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Nieudana próba usunięcia powiadomienia');
        }
        return { callback: 'Powiadomienie zostało usunięte', isOK: true };
    } catch (error) {
        console.error('Błąd usuwania powiadomienia ', error);
        return { callback: 'Błąd usuwania powiadomienia ' + error, isOK: false };
    }
}
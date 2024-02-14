
// '==========================================================================================================================================
// '*********************** Queue API ********************************************************************************************************
// '==========================================================================================================================================

import { Queue } from "../classes/queue";

interface Foo {
    callback: string;
    isOK: boolean;
}

export async function api_QueueList_add(queueList: []) {
    try {
        const response = await fetch('http://localhost:8080/api/queue/addList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queueList),
        });
        if (response.ok) {
            console.log('Kolejka została dodana');
        } else {
            console.log('Kolejka nie została dodana ');
        }
    } catch (error) {
        console.error('Błąd dodawania Kolejki ' + error);
    }
}

export async function api_QueueList_getAll(): Promise<Queue[]> {
    try {
        const response = await fetch('http://localhost:8080/api/queue/getAll');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania kolejek:', error);
        return [];
    }
}

export async function api_User_delete(id: number): Promise<Foo> {
    try {
        const response = await fetch('http://localhost:8080/api/queue/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            return { callback: 'Kolejka została usunięta', isOK: true };
        } else {
            return { callback: 'Kolejka nie została usunięta', isOK: false };
        }
    } catch (error) {
        return { callback: 'Błąd usuwania kolejki ' + error, isOK: false };
    }
}
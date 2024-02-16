// '==========================================================================================================================================
// '*********************** Queue API ********************************************************************************************************
// '==========================================================================================================================================
import { Queue } from "../classes/queue";

interface Foo {
    callback: string;
    isOK: boolean;
}

export async function api_queue_add(queue: Queue) {
    try {
        const response = await fetch('http://localhost:8080/api/queue/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queue),
        });
        if (response.ok) {
            return { callback: 'Kolejka została dodana', isOK: true };
        } else {
            return { callback: 'Kolejka nie została dodana ' + response, isOK: false };
        }
    } catch (error) {
        console.error('Błąd dodawania Kolejki ' + error);
        return { callback: 'Błąd dodawania Kolejki ' + error, isOK: false };
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

export async function api_queue_update(queue: Queue): Promise<Foo> {
    try {
        const response = await fetch('http://localhost:8080/api/queue/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queue),
        });
        if (response.ok) {
            return { callback: 'Kolejka została edytowana', isOK: true };
        } else {
            return { callback: 'Kolejka nie została edytowana ' + response, isOK: false };
        }
    } catch (error) {
        return { callback: 'Błąd edytowania kolejki ' + error, isOK: false };
    }
}
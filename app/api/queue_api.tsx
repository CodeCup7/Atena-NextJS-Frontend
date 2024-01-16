
// '==========================================================================================================================================
// '*********************** Queue API ********************************************************************************************************
// '==========================================================================================================================================

import { Queue } from "../classes/queue";

interface Foo {
    callback: string;
    isOK: boolean;
}

export async function api_Queue_add(queue: Queue): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/queue/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queue),
        });

        if (response.ok) {
            foo.callback = 'Kolejka został dodany';
            foo.isOK = true;
        } else {
            foo.callback = 'Kolejka nie został dodany';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania Kolejki ' + error, isOK: false };
    }
}

export async function api_QueueList_add(queueList: []) {
    fetch('http://localhost:8080/api/queue/addList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Określenie, że dane są w formacie JSON
        },
        body: JSON.stringify(queueList),
    })
        .then(response => {
            if (response.ok) {
                console.log('Kolejka została dodana');
            } else {
                console.log('Kolejka nie została dodana ');;
            }

        })
        .catch(error => {
            console.log('Błąd dodawania Kolejki ' + error)
        });
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


export async function api_Queue_update(queue: Queue): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/queue/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queue),
        });

        if (response.ok) {
            foo.callback = 'Kolejka została edytowana';
            foo.isOK = true;
        } else {
            foo.callback = 'Kolejka nie została edytowana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd edytowania Kolejki ' + error, isOK: false };
    }
}

export async function api_User_delete(id: number): Promise<Foo> {
    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/queue/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            foo.callback = 'Kolejka została usunięta';
            foo.isOK = true;
        } else {
            foo.callback = 'Kolejka nie została usunięta';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd usuwania kolejki ' + error, isOK: false };
    }
}

// '==========================================================================================================================================
// '*********************** Queue API ********************************************************************************************************
// '==========================================================================================================================================

import { Queue } from "../classes/queue";
import { queueList } from "../factory/factory_queue";

interface Foo {
    callback: string;
    isOK: boolean;
}

export function api_Queue_add(queue: Queue): string {

    fetch('http://localhost:8080/api/queue/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(queue),
    })
        .then(response => {
            if (response.ok) {
                console.log('Kolejka została dodana');
            } else {
                console.log('Kolejka nie została dodana ');;
            }
        })
        .catch(error => {
            console.log('Błąd dodawania Kolejka ')
        });

    return "";
}

export function api_QueueList_add(): string {

    fetch('http://localhost:8080/api/queue/addList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
            console.log('Błąd dodawania Kolejka ')
        });
    return "";
}

export async function api_User_update(queue: Queue): Promise<Foo> {

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
            foo.callback = 'Kolejka został edytowana';
            foo.isOK = true;
        } else {
            foo.callback = 'Kolejka nie został edytowana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd edytowania Użytkownika ' + error, isOK: false };
    }  
}

export async function api_User_delete(queueId: number): Promise<Foo> {
    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/queue/delete/' + queueId, {
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





import { Queue } from "../classes/queue";
import { queueList } from "../factory/factory_queue";

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




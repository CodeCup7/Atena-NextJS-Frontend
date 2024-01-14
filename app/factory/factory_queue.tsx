// '==========================================================================================================================================
// '*********************** Queue Factory ****************************************************************************************************
// '==========================================================================================================================================

import { Queue } from "../classes/queue";

export function CreateNewEmptyQueue() {

    let queue = new Queue();
    return queue;

}

export function CreateQueue(id: number, nameQueue: string, available: boolean) {

    let queue = new Queue();
    queue.available = available;
    queue.id = id;
    queue.nameQueue = nameQueue;

    return queue;
}

export let queueList: Queue[] = [];

const queue1 = CreateQueue(1, "Zamówienia", true);
const queue2 = CreateQueue(2, "Cennik", true);

const queue3 = CreateQueue(3, "Elektroniczny nadawca", true);
const queue4 = CreateQueue(4, "E-Sklep", true);
const queue5 = CreateQueue(5, "Infolinia Eng", true);

queueList.push(queue1, queue2, queue3, queue4, queue5);
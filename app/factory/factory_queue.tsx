// '==========================================================================================================================================
// '*********************** Queue Factory ****************************************************************************************************
// '==========================================================================================================================================
import { api_QueueList_getAll } from "../api/queue_api";
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

export let global_queueList: Queue[] = [];

export async function updateQueueList() {
    try {
        global_queueList = await api_QueueList_getAll();
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
    }

    return global_queueList
}
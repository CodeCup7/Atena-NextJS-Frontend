// '==========================================================================================================================================
// '*********************** NoteCC API *******************************************************************************************************
// '==========================================================================================================================================

import { NoteCC } from "../classes/noteCC";
import { SearchCriteria } from "../classes/filtrs/searchCriteria";

interface Foo {
    callback: string;
    isOK: boolean;
    noteCC: NoteCC
}

export async function api_NoteCC_add(noteCC: NoteCC): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, noteCC: noteCC };

        const response = await fetch('http://localhost:8080/api/noteCC/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteCC)
        });

        if (response.ok) {
            const addedNoteCC = await response.json();
            foo.callback = 'Coaching został dodana';
            foo.isOK = true;
            foo.noteCC = addedNoteCC;
        } else {
            foo.callback = 'Coaching nie został dodana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, noteCC:noteCC };
    }
}

export async function api_NoteCC_getDate(startDate: string, endDate: string): Promise<NoteCC[]> {

    try {
        const response = await fetch('http://localhost:8080/api/noteCC/getAllNoteBetweenDates/'
            + startDate + '/' + endDate);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function api_NoteCC_search(searchCriteria:SearchCriteria[]): Promise<NoteCC[]> {

    try {
        const response = await fetch('http://localhost:8080/api/noteCC/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchCriteria)
        });

        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function api_NoteCC_update(noteCC: NoteCC): Promise<Foo> {
    try {
        let foo: Foo = { callback: '', isOK: false, noteCC: noteCC };

        const response = await fetch('http://localhost:8080/api/noteCC/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteCC),
        });

        if (response.ok) {
            foo.callback = 'Coaching został edytowany';
            foo.isOK = true;
        } else {
            foo.callback = 'Coaching nie został edytownay';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, noteCC:noteCC };
    }
}

export async function api_NoteCC_deleteNote(noteCC: NoteCC): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, noteCC: noteCC };

        const response = await fetch('http://localhost:8080/api/noteCC/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteCC),
        });

        if (response.ok) {
            foo.callback = 'Coaching został usunięty';
            foo.isOK = true;
        } else {
            foo.callback = 'Coaching nie został usunięty';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, noteCC:noteCC };
    }
}


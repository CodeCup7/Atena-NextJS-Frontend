// '==========================================================================================================================================
// '*********************** NoteCC API *******************************************************************************************************
// '==========================================================================================================================================
import { NoteCC } from "../classes/rates/noteCC";
import { SearchCriteria } from "../classes/filtrs/searchCriteria";

interface Foo {
    callback: string;
    isOK: boolean;
    noteCC: NoteCC;
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
            foo.callback = 'Coaching został dodany';
            foo.isOK = true;
            foo.noteCC = addedNoteCC;
        } else {
            foo.callback = 'Coaching nie został dodany';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        console.error('Błąd dodawania coachingu:', error);
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, noteCC: noteCC };
    }
}
export async function api_NoteCC_getDate(startDate: string, endDate: string): Promise<NoteCC[]> {
    try {
        const response = await fetch('http://localhost:8080/api/noteCC/getAllNoteBetweenDates/' + startDate + '/' + endDate);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania ocen RateCC:', error);
        return [];
    }
}
export async function api_noteCC_getById(id: number): Promise<NoteCC> {
    try {
        const response = await fetch('http://localhost:8080/api/noteCC/getById/' + id);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania ocen RateCC:', error);
        return new NoteCC();
    }
}
export async function api_NoteCC_search(searchCriteria: SearchCriteria[]): Promise<NoteCC[]> {
    try {
        const response = await fetch('http://localhost:8080/api/noteCC/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchCriteria)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd wyszukiwania ocen RateCC:', error);
        return [];
    }
}
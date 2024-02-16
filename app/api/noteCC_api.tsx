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
            return { callback: 'Ocena została dodana', isOK: true, noteCC: addedNoteCC };
        } else {
            return { callback: 'Coaching nie został dodany ' + response, isOK: false, noteCC: new NoteCC() };
        }
    } catch (error) {
        console.error('Błąd dodawania coachingu:', error);
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, noteCC: noteCC };
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
            return { callback: 'Coaching został edytowany', isOK: true, noteCC: noteCC };
        } else {
            return { callback: 'Coaching nie został edytownay ' + response, isOK: false, noteCC: new NoteCC() };
        }
    } catch (error) {
        console.error('Błąd edytowania coachingu:', error);
        return { callback: 'Błąd edytowania coachingu ' + error, isOK: false, noteCC: noteCC };
    }
}

export async function api_NoteCC_updateRateList(noteCC: NoteCC): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, noteCC: noteCC };

        const response = await fetch('http://localhost:8080/api/noteCC/updateRateList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteCC),
        });

        if (response.ok) {
            return { callback: 'Zaaktualizowano listę ocen', isOK: true, noteCC: noteCC };
        } else {
            return { callback: 'Nie zaktualizowano listy ocen ' + response, isOK: false, noteCC: new NoteCC() };
        }
    } catch (error) {
        console.error('Błąd aktualizacji listy ocen', error);
        return { callback: 'Błąd aktualizacji listy ocen ' + error, isOK: false, noteCC: noteCC };
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
            return { callback: 'Coaching usunięty', isOK: true, noteCC: noteCC };
        } else {
            return { callback: 'Coaching nie usunięty ' + response, isOK: false, noteCC: new NoteCC() };
        }
    } catch (error) {
        console.error('Błąd usuwania coachingu', error);
        return { callback: 'Błąd usuwania coachingu ' + error, isOK: false, noteCC: noteCC };
    }
}
export async function api_noteCC_export(noteCC: NoteCC): Promise<void> {
    console.log(JSON.stringify(noteCC))
    try {
        const response = await fetch('http://localhost:8080/api/noteCC/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteCC)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = noteCC.id + '_coaching_eksport.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
    }
}
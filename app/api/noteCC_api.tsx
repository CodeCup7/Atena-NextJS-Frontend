import { NoteCC } from "../classes/noteCC";

interface Foo {
    callback: string;
    isOK: boolean;
}

export async function api_NoteCC_add(noteCC: NoteCC): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/noteCC/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteCC)
        });

        if (response.ok) {
            foo.callback = 'Coaching został dodana';
            foo.isOK = true;
        } else {
            foo.callback = 'Coaching nie został dodana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false };
    }
}

export async function api_NoteCC_getDate(startDate: string, endDate: string): Promise<NoteCC[]> {

    try {
        const response = await fetch('http://localhost:8080/api/noteCC/getAllNoteBetweenDates/'
            + startDate + '/' + endDate );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function api_NoteCC_deleteNote() {

}

export async function api_NoteCC_update() {

}
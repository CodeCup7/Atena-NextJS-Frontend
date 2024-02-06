// '==========================================================================================================================================
// '*********************** Test API ********************************************************************************************************
// '==========================================================================================================================================

import { SearchCriteria } from "../classes/searchCriteria";
import { Test } from "../classes/test";

interface Foo {
    callback: string;
    isOK: boolean;
    test:Test;
}

export async function api_Test_add(test:Test): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, test: test};

        const response = await fetch('http://localhost:8080/api/test/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(test)
        });

        if (response.ok) {
            const addedtest = await response.json();
            foo.callback = 'Test został dodany';
            foo.isOK = true;
            foo.test = addedtest;
        } else {
            foo.callback = 'Test nie został dodany';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania testu ' + error, isOK: false, test: test};
    }
}

export async function api_Test_getDate(startDate: string, endDate: string): Promise<Test[]> {

    try {
        const response = await fetch('http://localhost:8080/api/test/getAllTSestDates/'
            + startDate + '/' + endDate);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function api_Test_search(searchCriteria:SearchCriteria[]): Promise<Test[]> {

    try {
        const response = await fetch('http://localhost:8080/api/test/search', {
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

export async function api_Test_delete(test: Test): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, test: test};

        const response = await fetch('http://localhost:8080/api/test/delete/' + test.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(test),
        });

        if (response.ok) {
            foo.callback = 'Test został usunięty';
            foo.isOK = true;
        } else {
            foo.callback = 'Test nie został usunięty';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, test: test};
    }
}



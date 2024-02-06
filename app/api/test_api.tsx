// '==========================================================================================================================================
// '*********************** Tests API ********************************************************************************************************
// '==========================================================================================================================================

import { Feedback } from "../classes/feedback";
import { SearchCriteria } from "../classes/searchCriteria";
import { Tests } from "../classes/tests";

interface Foo {
    callback: string;
    isOK: boolean;
    tests:Tests;
}

export async function api_Tests_add(tests:Tests): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, tests: tests};

        const response = await fetch('http://localhost:8080/api/tests/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tests)
        });

        if (response.ok) {
            const addedTests = await response.json();
            foo.callback = 'Test został dodany';
            foo.isOK = true;
            foo.tests = addedTests;
        } else {
            foo.callback = 'Test nie został dodany';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania testu ' + error, isOK: false, tests: tests};
    }
}

export async function api_Tests_getDate(startDate: string, endDate: string): Promise<Tests[]> {

    try {
        const response = await fetch('http://localhost:8080/api/tests/getAllTestsDates/'
            + startDate + '/' + endDate);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function api_Tests_search(searchCriteria:SearchCriteria[]): Promise<Tests[]> {

    try {
        const response = await fetch('http://localhost:8080/api/tests/search', {
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

export async function api_Tests_delete(tests: Tests): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, tests: tests};

        const response = await fetch('http://localhost:8080/api/tests/delete/' + tests.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tests),
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
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, tests: tests};
    }
}



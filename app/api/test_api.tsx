// '==========================================================================================================================================
// '*********************** Test API ********************************************************************************************************
// '==========================================================================================================================================
import { SearchCriteria } from "../classes/filtrs/searchCriteria";
import { Test } from "../classes/test";

interface Foo {
    callback: string;
    isOK: boolean;
    test: Test;
}

export async function api_Test_add(test: Test): Promise<Foo> {

    try {

        const response = await fetch('http://localhost:8080/api/test/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(test)
        });

        if (response.ok) {
            return { callback: 'Test został dodany', isOK: true, test: test };
        } else {
            return { callback: 'Test nie został dodany ' + response, isOK: false, test: test };
        }

    } catch (error) {
        return { callback: 'Błąd dodawania testu ' + error, isOK: false, test: test };
    }
}

export async function api_Test_addAll(testList: Test[]) {

    try {
        const response = await fetch('http://localhost:8080/api/test/addList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testList)
        });

        if (response.ok) {
            return { callback: 'Testy zostały dodane', isOK: true, test: new Test() };
        } else {
            return { callback: 'Testy nie zostały dodane' + response, isOK: false, test: new Test() };
        }

    } catch (error) {
        return { callback: 'Błąd dodawania testu ' + error, isOK: false, test: new Test() };
    }
}

export async function api_Test_getDate(startDate: string, endDate: string): Promise<Test[]> {

    try {
        const response = await fetch('http://localhost:8080/api/test/getAllTestDates/'
            + startDate + '/' + endDate);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error during API call:', error);
        return [];
    }
}

export async function api_Test_search(searchCriteria: SearchCriteria[]): Promise<Test[]> {

    try {
        const response = await fetch('http://localhost:8080/api/test/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchCriteria)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during API call:', error);
        return [];
    }
}

export async function api_Test_delete(test: Test): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, test: test };

        const response = await fetch('http://localhost:8080/api/test/delete/' + test.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(test),
        });


        if (response.ok) {
            return { callback: 'Test został usunięty', isOK: true, test: new Test() };
        } else {
            return { callback: 'Test nie został usunięty' + response, isOK: false, test: new Test() };
        }

    } catch (error) {
        return { callback: 'Błąd dodawania coachingu ' + error, isOK: false, test: new Test() };
    }
}


// '==========================================================================================================================================
// '*********************** RateCC API *******************************************************************************************************
// '==========================================================================================================================================

import { RateCC } from "../classes/rates/rateCC";
import { SearchCriteria } from "../classes/filtrs/searchCriteria";

interface Foo {
    callback: string;
    isOK: boolean;
    rateCC: RateCC
}

export async function api_rateCC_add(rateCC: RateCC): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, rateCC: rateCC };

        const response = await fetch('http://localhost:8080/api/rateCC/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateCC)
        });

        if (response.ok) {
            const addedRateCC = await response.json(); // Pobierz zaktualizowany obiekt z odpowiedzi
            foo.callback = 'Ocena została dodana';
            foo.isOK = true;
            foo.rateCC = addedRateCC;
        } else {
            foo.callback = 'Ocena nie została dodana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateCC: rateCC };
    }
}


export async function api_rateCC_update(rateCC: RateCC): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, rateCC: rateCC };

        const response = await fetch('http://localhost:8080/api/rateCC/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateCC)
        });

        if (response.ok) {
            foo.callback = 'Ocena została edytowana';
            foo.isOK = true;
        } else {
            foo.callback = 'Ocena nie została edytowana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateCC: rateCC };
    }
}

export async function api_RateCC_search(searchCriteria:SearchCriteria[]): Promise<RateCC[]> {

    try {
        const response = await fetch('http://localhost:8080/api/rateCC/search', {
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

export async function api_rateCC_getById(id: number): Promise<RateCC> {
    try {
        const response = await fetch('http://localhost:8080/api/rateCC/getById/' + id);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Błąd pobierania ocen RateCC:', error);
        return new RateCC();
    }
}

export async function api_rateCC_getAllRateNoNote(): Promise<RateCC[]> {
    try {
        const response = await fetch('http://localhost:8080/api/rateCC/getAllRateNoNote');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const rateList: Array<RateCC> = await response.json();

        return rateList;
    } catch (error) {
        console.error('Błąd pobierania ocen RateCC:', error);
        return [];
    }
}

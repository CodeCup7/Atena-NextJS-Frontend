import { RateCC } from "../classes/rateCC";

interface Foo {
    callback: string;
    isOK: boolean;
}

export async function api_rateCC_add(rateCC: RateCC): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false };

        const response = await fetch('http://localhost:8080/api/rateCC/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateCC)
        });

        if (response.ok) {
            foo.callback = 'Ocena została dodana';
            foo.isOK = true;
        } else {
            foo.callback = 'Ocena nie została dodana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false };
    }
}

export function api_rateCC_get(): RateCC {

    return new RateCC();
}

export function api_rateCC_getAll(): [] {

    return [];
}

export function api_rateCC_deleteRate() {

}

export function api_rateCC_update() {

}
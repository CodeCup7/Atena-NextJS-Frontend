import { RateCC } from "../classes/rateCC";

export function api_rateCC_add(rateCC: RateCC): string {

    let callback = '';
    fetch('http://localhost:8080/api/rateCC/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Określenie, że dane są w formacie JSON
        },

        body: JSON.stringify(rateCC)
    })
        .then(response => {
            if (response.ok) {
                callback = 'Ocena została dodana';
            } else {
                callback = 'Ocena nie została dodana ' + response;
            }

        })
        .catch(error => {
            callback = 'Błąd dodawania oceny ' + error;
        });

    return callback;
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
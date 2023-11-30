import { RateBlock } from "../classes/rateBlock";
import { RateCC } from "../classes/rateCC";
import { RatePart } from "../classes/ratePart";

export function api_rateBlock_add(rateBlock: RateBlock): string {

    let callback = '';
    console.log(rateBlock);
    fetch('http://localhost:8080/api/rateBlock/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Określenie, że dane są w formacie JSON
        },
        
        body: JSON.stringify(rateBlock),
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

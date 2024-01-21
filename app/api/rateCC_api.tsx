// '==========================================================================================================================================
// '*********************** RateCC API *******************************************************************************************************
// '==========================================================================================================================================

import { RateBlock } from "../classes/rateBlock";
import { RateCC } from "../classes/rateCC";
import { RatePart } from "../classes/ratePart";
import { key_k, key_o, key_s, key_t, key_w, key_w1 } from "../globalKeys";

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

export async function api_rateCC_getAllRateNoNote(): Promise<RateCC[]> {
    try {
        const response = await fetch('http://localhost:8080/api/rateCC/getAllRateNoNote');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const rateList: Array<RateCC> = await response.json();

        rateList.forEach(rateCC => {

            rateCC.wiedzaBlock = new RateBlock(key_w);
            rateCC.obslugaBlock = new RateBlock(key_o);
            rateCC.technikaBlock = new RateBlock(key_t);
            rateCC.komunikacjaBlock = new RateBlock(key_k);
            rateCC.standardBlock = new RateBlock(key_s);

            const ratePartList: Array<RatePart> = rateCC.ratePart

            ratePartList.forEach(ratePart => {

                switch (ratePart.key.substring(0, 5)) { // Pierwsze  liter z KEY
                    case key_w:
                        rateCC.wiedzaBlock.ratePart.push(ratePart);
                        break;
                    case key_o:
                        rateCC.obslugaBlock.ratePart.push(ratePart);
                        break;
                    case key_s:
                        rateCC.standardBlock.ratePart.push(ratePart);
                        break;
                    case key_t:
                        rateCC.technikaBlock.ratePart.push(ratePart);
                        break;
                    case key_k:
                        rateCC.komunikacjaBlock.ratePart.push(ratePart);
                        break;
                }
            })
        });

        return rateList;
    } catch (error) {
        console.error('Błąd pobierania ocen RateCC:', error);
        return [];
    }
}

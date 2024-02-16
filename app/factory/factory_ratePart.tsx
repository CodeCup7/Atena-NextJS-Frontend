// '==========================================================================================================================================
// '*********************** RatePart Factory *************************************************************************************************
// '==========================================================================================================================================
import { RatePart } from "../classes/rates/ratePart";
import { getWagRateCC, getWagRateM } from "../globalKeys";

export function CreateNewEmptyRatePartCC(key_: string) {

    let ratePart = new RatePart();
    ratePart.key = key_;
    ratePart.waga = getWagRateCC(key_);
    ratePart.ocena = 1;
    return ratePart;

}

export function CreateNewEmptyRatePartM(key_: string) {

    let ratePart = new RatePart();
    ratePart.key = key_;
    ratePart.waga = getWagRateM(key_);
    ratePart.ocena = 1;
    return ratePart;

}

export function CreateRatePart(key: string, ocena: number, waga: number, nieprawidlowosci: string, opis: string, uwagi: string, used: boolean) {

    let ratePart = new RatePart();

    ratePart.key = key;
    ratePart.ocena = ocena;
    ratePart.waga = waga;
    ratePart.nieprawidlowosci = nieprawidlowosci;
    ratePart.opis = opis;
    ratePart.uwagi = uwagi;

    return ratePart;
}


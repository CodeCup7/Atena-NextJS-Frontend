// '==========================================================================================================================================
// '*********************** RatePart Factory *************************************************************************************************
// '==========================================================================================================================================
import { Type_Rate } from "../classes/enums";
import { RatePart } from "../classes/rates/ratePart";
import { getWagRate } from "../globalKeys";

export function CreateNewEmptyRatePart(key_: string, typeRate: Type_Rate) {

    let ratePart = new RatePart();
    ratePart.key = key_;
    ratePart.waga = getWagRate(key_, typeRate);
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


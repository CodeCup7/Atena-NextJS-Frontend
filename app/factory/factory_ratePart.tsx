// '==========================================================================================================================================
// '*********************** RatePart Factory *************************************************************************************************
// '==========================================================================================================================================

import { Adamina } from "next/font/google";
import { RatePart } from "../classes/ratePart";
import { getWagRateCC } from "../globalKeys";

export function CreateNewEmptyRatePart(key_: string) {

    let ratePart = new RatePart();
    ratePart.key = key_;
    ratePart.waga = getWagRateCC(key_);
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


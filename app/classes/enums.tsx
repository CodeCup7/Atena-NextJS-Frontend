// '==========================================================================================================================================
// '*********************** AppEnum CLASS ****************************************************************************************************
// '==========================================================================================================================================

export enum Status_Note {
    NO_START = "NO_START",
    CLOSE = "CLOSE",
    CLOSE_WITHOUT = "CLOSE_WITHOUT",
};

export const StatusLabels: Record<Status_Note, string> = {
    [Status_Note.NO_START]: "Nie rozpoczęty",
    [Status_Note.CLOSE]: "Zamknięty",
    [Status_Note.CLOSE_WITHOUT]: "Zamknięty BEZ",
};

export enum Type_RateCC {

    RATTING_ = "Karta Oceny",
    CURRENT_ = "Bieżący Odsłuch",
    MYSTERY_ = "Tajemniczy Klient",
};

export enum Rate_Mode {
    NEW_ = "Nowa",
    EDIT_ = "Edycja",
    PREVIEW_ = "Podgląd",
    LOAD_ = "Załadowany",
};
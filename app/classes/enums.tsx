// '==========================================================================================================================================
// '*********************** AppEnum CLASS ****************************************************************************************************
// '==========================================================================================================================================

export enum Status_Note {
    ALL,
    NO_START,
    CLOSE,
    CLOSE_WITHOUT,
};

export const StatusLabels: Record<Status_Note, string> = {
    [Status_Note.ALL]: "Wszystkie",
    [Status_Note.NO_START]: "Nie rozpoczęty",
    [Status_Note.CLOSE]: "Zamknięty",
    [Status_Note.CLOSE_WITHOUT]: "Zamknięty BEZ",
};

export enum Type_RateCC {

    RATTING_,
    CURRENT_,
    MYSTERY_,
};

export const TypeLabels: Record<Type_RateCC, string> = {
    [Type_RateCC.RATTING_]: "Karta Oceny",
    [Type_RateCC.CURRENT_]: "Bierzący Odsłuch",
    [Type_RateCC.MYSTERY_]: "Tajemniczy Klient",
};


export enum Rate_Mode {
    NEW_,
    EDIT_,
    PREVIEW_,
    LOAD_,
};

export const ModeLabels: Record<Rate_Mode, string> = {
    [Rate_Mode.NEW_]: "Nowy",
    [Rate_Mode.EDIT_]: "Edycja",
    [Rate_Mode.PREVIEW_]: "Podgląd",
    [Rate_Mode.LOAD_]: "Załadowany",
};
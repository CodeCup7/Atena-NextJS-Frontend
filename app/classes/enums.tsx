// '==========================================================================================================================================
// '*********************** AppEnum CLASS ****************************************************************************************************
// '==========================================================================================================================================

export enum Status_Note {
    ALL = '0',
    NO_START = '1',
    CLOSE = '2',
    CLOSE_WITHOUT = '3',
};

export const StatusLabels: Record<Status_Note, string> = {
    [Status_Note.ALL]: "Wszystkie",
    [Status_Note.NO_START]: "Nie rozpoczęty",
    [Status_Note.CLOSE]: "Zamknięty",
    [Status_Note.CLOSE_WITHOUT]: "Zamknięty BEZ",
};

export enum Type_RateCC {
    ALL = '0',
    RATTING_ = '1',
    CURRENT_ = '2',
    MYSTERY_ = '3',
  };

export const TypeLabels: Record<Type_RateCC, string> = {
    [Type_RateCC.ALL]: "Wszystkie",
    [Type_RateCC.RATTING_]: "Karta Oceny",
    [Type_RateCC.CURRENT_]: "Bierzący Odsłuch",
    [Type_RateCC.MYSTERY_]: "Tajemniczy Klient",
};


export enum Rate_Mode {
    NEW_ = '0',
    EDIT_ = '1',
    PREVIEW_ = '2',
    LOAD_ = '3',
};

export const ModeLabels: Record<Rate_Mode, string> = {
    [Rate_Mode.NEW_]: "Nowy",
    [Rate_Mode.EDIT_]: "Edycja",
    [Rate_Mode.PREVIEW_]: "Podgląd",
    [Rate_Mode.LOAD_]: "Załadowany",
};
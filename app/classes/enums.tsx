// '==========================================================================================================================================
// '*********************** AppEnum CLASS ****************************************************************************************************
// '==========================================================================================================================================

export enum Status_Note {
    ALL_ = 'ALL_',
    NO_START_ = 'NO_START_',
    CLOSE_ = 'CLOSE_',
    CLOSE_WITHOUT_ = 'CLOSE_WITHOUT_',
    APPEAL_ = 'APPEAL_',
};

export const StatusLabels: Record<Status_Note, string> = {
    [Status_Note.ALL_]: "Wszystkie",
    [Status_Note.NO_START_]: "Nie rozpoczęty",
    [Status_Note.CLOSE_]: "Zamknięty",
    [Status_Note.CLOSE_WITHOUT_]: "Zamknięty BEZ",
    [Status_Note.APPEAL_]: "Odwołanie",
};

export enum Type_RateCC {
    ALL_ = 'ALL_',
    RATTING_ = 'RATTING_',
    CURRENT_ = 'CURRENT_',
    MYSTERY_ = 'MYSTERY_',
  };

  export enum Type_Rate {
    ALL_ = 'ALL_',
    CC_ = 'CC_',
    M_ = 'M_',
  };

export const TypeLabels: Record<Type_RateCC, string> = {
    [Type_RateCC.ALL_]: "Wszystkie",
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
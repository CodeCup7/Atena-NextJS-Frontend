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

    RATTING_,
    CURRENT_,
    MYSTERY_,
};

export enum Rate_Mode {
    NEW_,
    EDIT_,
    PREVIEW_,
    LOAD_,
};
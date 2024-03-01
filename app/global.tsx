//================================================================
//*********************** Global Varible *************************
//================================================================
export const app_name: String = "Atena";
export const app_version: String = "0.0.1";

// '==========================================================================================================================================
// '*********************** Wartości ocen ****************************************************************************************************
// '==========================================================================================================================================
export function valueOfRatePartCC(): Array<number> {

    let rateList = new Array<number>();

    rateList.push(0);
    rateList.push(1);

    return rateList;

}

export const extraRate_minValue: number = -10
export const extraRate_maxValue: number = 10

// '==========================================================================================================================================
// '*********************** Funkcje Globalne *************************************************************************************************
// '==========================================================================================================================================

/**
 * Funkcja zwraca zakres dat na podstawie przesłanej daty. Zakres ustalany jest na podstawie przesłanego paramerty 'howManyMonths'. Następuje ustalenie ile miesięcy w stecz ma zostać ustalony początek zakresu. 
 * np dla przesłanego dateValue = 18-02-2024 i parametry howManyMonths = 3 zostanie zwrócony startDate = 01.12.2023 i endDate = 29.02.2024
 * @param {string} dateValue - Data w formacie 'YYYY-MM'.
 * @param {number} howManyMonths - Liczba miesięcy wstecz. 0 - tylko bieżący miesiąc 2 - bieżący miesiąc i 2 miesiące wstecz. 
 * @returns {{ startDate: Date, endDate: Date }} Obiekt zawierający datę początkową i końcową.
 */
export function calculateStartEndDate(dateValue: string, howManyMonths: number): { startDate: Date, endDate: Date } {
    const parts = dateValue.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    
    const startDate = new Date(year, month - howManyMonths, 1);
    const endDate = new Date(year, month + 1, 0);

    return {
        startDate,
        endDate
    };
}

/**
 * Funkcja zwraca zakres dat poprzedniego miesiąca od daty przesłanej
 * np dla przesłanego dateValue = 18-02-2024 zostanie zwrócony startDate = 01.01.2024 i endDate = 31.01.2024
 * @param {string} dateValue - Data w formacie 'YYYY-MM'
 * @returns {{ startDate: Date, endDate: Date }} Obiekt zawierający datę początkową i końcową.
 */
export function calculatePrevMonth(dateValue: string): { startDate: Date, endDate: Date } {
console.log('dateValue :', dateValue);
    const [year, month, day] = dateValue.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);

    let startDate: Date;
    let endDate: Date;

    if (currentDate.getDate() === 1) {
         // Jeśli data to pierwszy dzień stycznia, cofnij się o jeden rok i zacznij od grudnia poprzedniego roku
        startDate = new Date(year, month - 2, 1);
        endDate = new Date(year, month - 1, 0);
    } else {
        // W przeciwnym razie zacznij od poprzedniego miesiąca
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
    }

    return { startDate, endDate };
}
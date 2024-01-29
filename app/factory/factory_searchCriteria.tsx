// '==========================================================================================================================================
// '*********************** SearchCriteria Factory *******************************************************************************************
// '==========================================================================================================================================

import { api_NoteCC_search } from "../api/noteCC_api";
import { StatusLabels, Status_Note } from "../classes/enums";
import { FiltrNoteCC } from "../classes/filtrNoteCC";
import { SearchCriteria } from "../classes/searchCriteria";

export function createSearchCriteriaByFiltrNoteCC(filtr: FiltrNoteCC) {

    const criteriaList: SearchCriteria[] = []

    if (filtr.appliesDateStart !== '' && filtr.appliesDateEnd != '') {

        // Ostatni dzień wybranego zakresu miesiąca DO
        const [year, month] = filtr.appliesDateEnd.split("-");
        const firstDayOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
        const firstDayOfNextMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1);
        const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
        const lastDay = lastDayOfMonth.getDate();

        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'appliesDate'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = filtr.appliesDateStart + '-01' + " AND " + filtr.appliesDateEnd + lastDay
        criteriaList.push(dateCriteria)
    }
    if (filtr.coachDateStart !== '' && filtr.coachDateEnd !== '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'coachDate'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = filtr.coachDateStart + " AND " + filtr.coachDateEnd
        criteriaList.push(dateCriteria)
    }
    if (filtr.zalecenia !== '') {
        const zalecenia = new SearchCriteria();
        zalecenia.key = 'zalecenia'
        zalecenia.operation = 'LIKE'
        zalecenia.value = filtr.zalecenia
        criteriaList.push(zalecenia)
    }
    if (filtr.odwolanie !== '') {
        const zalecenia = new SearchCriteria();
        zalecenia.key = 'odwolanie'
        zalecenia.operation = 'LIKE'
        zalecenia.value = filtr.odwolanie
        criteriaList.push(zalecenia)
    }
    if (filtr.id > 0) {
        const id = new SearchCriteria();
        id.key = 'id'
        id.operation = ':'
        id.value = filtr.id.toString()
        criteriaList.push(id)
    }
    if (filtr.status !== Status_Note.ALL) {
        const status = new SearchCriteria();
        status.key = 'status'
        status.operation = ':'
        status.value = filtr.status.toString()
        criteriaList.push(status)
    }
    if (filtr.allOdwolania === true) {
        const allOdwolania = new SearchCriteria();
        allOdwolania.key = 'odwolanie'
        allOdwolania.operation = ':'
        allOdwolania.value = ''
        criteriaList.push(allOdwolania)
    }

    return criteriaList;

}
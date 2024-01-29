// '==========================================================================================================================================
// '*********************** SearchCriteria Factory *******************************************************************************************
// '==========================================================================================================================================

import { api_NoteCC_search } from "../api/noteCC_api";
import { FiltrNoteCC } from "../classes/filtrNoteCC";
import { SearchCriteria } from "../classes/searchCriteria";

export async function createSearchCriteriaByFiltrNoteCC(filtr: FiltrNoteCC) {

    const criteriaList: SearchCriteria[] = []

    if (filtr.appliesDateStart !== '' && filtr.appliesDateEnd != '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'appliesDate'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = filtr.appliesDateStart + " AND " + filtr.appliesDateEnd
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
    console.log(criteriaList)

    const noteList = await api_NoteCC_search(criteriaList);
    return noteList;

}
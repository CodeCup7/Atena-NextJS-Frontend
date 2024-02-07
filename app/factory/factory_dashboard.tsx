'use client'
// '==========================================================================================================================================
// '*********************** Dashboard Factory ************************************************************************************************
// '==========================================================================================================================================
import { useEffect } from "react";
import { FinalScore } from "../classes/finalScore";
import { User } from "../classes/user";
import { format } from "date-fns";
import { api_NoteCC_getDate, api_NoteCC_search } from "../api/noteCC_api";
import { SearchCriteria } from "../classes/searchCriteria";
import { FiltrNoteCC } from "../classes/filtrNoteCC";
import { createSearchCriteriaByFiltrNoteCC } from "./factory_searchCriteria";

export async function getFinalScoreData(dateValue: string, agent: User) {

    // Pobranie danych z bazy
    const final = new FinalScore();

    const parts = dateValue.split('-'); // Rozbijanie daty na części
    // Tworzenie daty z części daty
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1 //Indexowanie zaczyna się od zera
    const date = new Date(year, month, 1);
    // Ustawienie daty na pierwszy dzień miesiąca
    const startDate = new Date(year, month - 3, 1);
    // Obliczenie daty końcowej - ustawienie na ostatni dzień aktualnego miesiąca
    const endDate = new Date(year, month + 1, 0);

    final.startDate = format(new Date(startDate), 'yyyy-MM-dd');
    console.log('startDate :', startDate);
    final.endDate = format(new Date(endDate), 'yyyy-MM-dd');
    console.log('endDate :', endDate);

    const filtrNoteCC = new FiltrNoteCC();
    filtrNoteCC.appliesDateStart = final.startDate;
    filtrNoteCC.appliesDateEnd = final.endDate;
    filtrNoteCC.userCol.push(agent);
    
    const searchCriteria = createSearchCriteriaByFiltrNoteCC(filtrNoteCC);

    useEffect(() => {
        async function fetchData() {
            try {
                final.noteList = await api_NoteCC_search(searchCriteria);

            } catch (error) {
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, []);

    return final;
}

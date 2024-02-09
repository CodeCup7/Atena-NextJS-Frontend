'use client'
// '==========================================================================================================================================
// '*********************** Dashboard Factory ************************************************************************************************
// '==========================================================================================================================================
import { FinalScore } from "../classes/finalScore";
import { User } from "../classes/user";
import { format } from "date-fns";
import { api_NoteCC_search } from "../api/noteCC_api";
import { FiltrNoteCC } from "../classes/filtrs/noteCC_Filtr";
import { createSearchCriteriaByFiltrNoteCC } from "./factory_searchCriteria";
import { getNoteCC_Rate } from "./factory_noteCC";
import { getRateCC_Rate } from "./factory_rateCC";
import { getScore_Test } from "./factory_test";
import { Feedback_type } from "../classes/feedback";
import { getRateM_Rate } from "./factory_rateM";
import { api_Feedback_getDate } from "../api/feedback_api";
import { api_Test_getDate } from "../api/test_api";

export async function getFinalScoreData(dateValue: string, agent: User, howManyMonths: number) {

    // Pobranie danych z bazy
    const final = new FinalScore();

    const parts = dateValue.split('-'); // Rozbijanie daty na części
    // Tworzenie daty z części daty
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1 //Indexowanie zaczyna się od zera
    const date = new Date(year, month, 1);
    // Ustawienie daty na pierwszy dzień miesiąca
    const startDate = new Date(year, month - howManyMonths, 1);
    // Obliczenie daty końcowej - ustawienie na ostatni dzień aktualnego miesiąca
    const endDate = new Date(year, month + 1, 0);

    final.startDate = format(new Date(startDate), 'yyyy-MM-dd');
    final.endDate = format(new Date(endDate), 'yyyy-MM-dd');

    const filtrNoteCC = new FiltrNoteCC();
    filtrNoteCC.appliesDateStart = format(new Date(startDate), 'yyyy-MM');
    filtrNoteCC.appliesDateEnd = format(new Date(endDate), 'yyyy-MM');
    filtrNoteCC.userCol.push(agent);

    const searchCriteria = createSearchCriteriaByFiltrNoteCC(filtrNoteCC);
    final.noteList = await api_NoteCC_search(searchCriteria);

    final.noteList.forEach(noteCC=>{
        noteCC.rateCC_Col.forEach(rateCC=>{
            final.rateCCList.push(rateCC)
        })
    });

    final.feedbackList = await api_Feedback_getDate(final.startDate,  final.endDate);
    final.testList = await api_Test_getDate(final.startDate,  final.endDate);

    return final;
}

export function getFinalScore(final: FinalScore): number {

    let score: number = 0;
    final.noteList.forEach(noteCC => {
        score = score + getNoteCC_Rate(noteCC);
    });
    score = score / final.noteList.length
    return score;
}

export function getFinalScoreRateCCAndRateM(final: FinalScore): number {

    let score: number = 0;
    final.rateCCList.forEach(rateCC => {
        score = score + getRateCC_Rate(rateCC);
    });
    final.rateMList.forEach(rateM => {
        score = score + getRateM_Rate(rateM);
    });

    if (final.rateCCList.length + final.rateMList.length > 0) {
        score = score / (final.rateCCList.length + final.rateMList.length)
    }

    return score;
}

export function getFinalScoreMysteryAndCurrent(final: FinalScore): number {

    let score: number = 0;

    final.mysteryList.forEach(rateCC => {
        score = score + getRateCC_Rate(rateCC);
    });
    if (final.rateCCList.length > 0) {
        score = score / (final.rateCCList.length)
    }
    return score;
}

export function getFinalScoreTests(final: FinalScore): number {

    let score: number = 0;

    final.testList.forEach(test => {
        score = score + getScore_Test(test);
    });

    if (final.testList.length > 0) {
        score = score / (final.testList.length)
    }
    return score;
}

export function getFinalScoreFeedback(final: FinalScore): number {

    let score: number = 0;

    final.feedbackList.forEach(feedback => {
        feedback.feedback === Feedback_type.POSITIVE_ ? score++ : score--
    });
    if (final.feedbackList.length > 0) {
        score = score / (final.feedbackList.length)
    }

    return score;
}




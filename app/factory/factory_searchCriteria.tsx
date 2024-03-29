// '==========================================================================================================================================
// '*********************** SearchCriteria Factory *******************************************************************************************
// '==========================================================================================================================================
import { format } from "date-fns";
import { Status_Note, Type_RateCC } from "../classes/enums";
import { Feedback_type } from "../classes/feedback";
import { FiltrFeedback } from "../classes/filtrs/feedback_filtr";
import { FiltrNoteCC } from "../classes/filtrs/noteCC_Filtr";
import { FiltrRateCC } from "../classes/filtrs/rateCC_filtr";
import { FiltrRateM } from "../classes/filtrs/rateM_filtr";
import { SearchCriteria } from "../classes/filtrs/searchCriteria";
import { FiltrTest } from "../classes/filtrs/test_filtr";
import { TestPass } from "../classes/test";

export function createSearchCriteriaByFiltrRateCC(filtr: FiltrRateCC) {

    const criteriaList: SearchCriteria[] = []

    if (filtr.dateRateStart !== '' && filtr.dateRateEnd !== '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'dateRate'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = format(filtr.dateRateStart, 'yyyy-MM-dd') + " AND " + format(filtr.dateRateEnd, 'yyyy-MM-dd')
        criteriaList.push(dateCriteria)
    }

    if (filtr.dateCallStart !== '' && filtr.dateCallEnd !== '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'dateCall'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = format(filtr.dateCallStart, 'yyyy-MM-dd') + " AND " + format(filtr.dateCallEnd, 'yyyy-MM-dd')
        criteriaList.push(dateCriteria)
    }
    if (filtr.id > 0) {
        const id = new SearchCriteria();
        id.key = 'id'
        id.operation = ':'
        id.value = filtr.id.toString()
        criteriaList.push(id)
    }
    if (filtr.typeRate !== Type_RateCC.ALL_) {
        const typeRate = new SearchCriteria();
        typeRate.key = 'typeRate'
        typeRate.operation = ':'
        typeRate.value = filtr.typeRate.toString()
        criteriaList.push(typeRate)
    }
    if (filtr.idCall !== '') {
        const idCall = new SearchCriteria();
        idCall.key = 'idCall'
        idCall.operation = ':'
        idCall.value = filtr.idCall
        criteriaList.push(idCall)
    }
    if (filtr.rateEnd !== '') {
        const rate = new SearchCriteria();
        rate.key = 'rate'
        rate.operation = 'BETWEEN'
        rate.value = filtr.rateStart + " AND " + filtr.rateEnd
        criteriaList.push(rate)
    }
    if (filtr.queueId !== '0') {
        const queue = new SearchCriteria();
        queue.key = 'queue'
        queue.operation = ':'
        queue.value = filtr.queueId
        criteriaList.push(queue)
    }
    if (filtr.noteCC.id !== 0) {
        const noteCC = new SearchCriteria();
        noteCC.key = 'noteCC'
        noteCC.operation = ':'
        noteCC.value = filtr.noteCC.id.toString();
        criteriaList.push(noteCC)
    }


    if(filtr.userCol.length > 0){
        filtr.userCol.forEach(user=>{
            const userCriteria = new SearchCriteria();
            userCriteria.key = 'agent'
            userCriteria.operation = ':'
            userCriteria.value = user.id.toString();
            criteriaList.push(userCriteria)
        })
    }
    console.log('criteriaList RATE_CC:', criteriaList);
    return criteriaList;

}

export function createSearchCriteriaByFiltrRateM(filtr: FiltrRateM) {

    const criteriaList: SearchCriteria[] = []

    if (filtr.dateRateStart !== '' && filtr.dateRateEnd !== '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'dateRate'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = format(filtr.dateRateStart, 'yyyy-MM-dd') + " AND " + format(filtr.dateRateEnd, 'yyyy-MM-dd')
        criteriaList.push(dateCriteria)
    }

    if (filtr.id > 0) {
        const id = new SearchCriteria();
        id.key = 'id'
        id.operation = ':'
        id.value = filtr.id.toString()
        criteriaList.push(id)
    }
    if (filtr.rateEnd !== '') {
        const rate = new SearchCriteria();
        rate.key = 'rate'
        rate.operation = 'BETWEEN'
        rate.value = filtr.rateStart + " AND " + filtr.rateStart
        criteriaList.push(rate)
    }
    if(filtr.userCol.length > 0){
        filtr.userCol.forEach(user=>{
            const userCriteria = new SearchCriteria();
            userCriteria.key = 'agent'
            userCriteria.operation = ':'
            userCriteria.value = user.id.toString();
            criteriaList.push(userCriteria)
        })
    }
    console.log('criteriaList RATE_M:', criteriaList);
    return criteriaList;

}

export function createSearchCriteriaByFiltrNoteCC(filtr: FiltrNoteCC) {

    const criteriaList: SearchCriteria[] = []

    if (filtr.appliesDateStart !== '' && filtr.appliesDateEnd != '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'appliesDate'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = format(filtr.appliesDateStart, 'yyyy-MM-dd')  + " AND " +  format(filtr.appliesDateEnd, 'yyyy-MM-dd');
        criteriaList.push(dateCriteria)
    }
    if (filtr.coachDateStart !== '' && filtr.coachDateEnd !== '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'coachDate'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = format(filtr.coachDateStart, 'yyyy-MM-dd') + " AND " + format(filtr.coachDateEnd, 'yyyy-MM-dd')
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
    if (filtr.status !== Status_Note.ALL_) {
        const status = new SearchCriteria();
        status.key = 'status'
        status.operation = ':'
        status.value = filtr.status.toString()
        criteriaList.push(status)
    }
    if (filtr.allOdwolania === true) {
        const allOdwolania = new SearchCriteria();
        allOdwolania.key = 'status'
        allOdwolania.operation = ':'
        allOdwolania.value = Status_Note.APPEAL_;
        criteriaList.push(allOdwolania)
    }
    if(filtr.userCol.length > 0){
        filtr.userCol.forEach(user=>{
            const userCriteria = new SearchCriteria();
            userCriteria.key = 'agent'
            userCriteria.operation = ':'
            userCriteria.value = user.id.toString();
            criteriaList.push(userCriteria)
        })

    }
    console.log('criteriaList NOTE:', criteriaList);
    return criteriaList;

}

export function createSearchCriteriaByFiltrTest(filtr: FiltrTest) {

    const criteriaList: SearchCriteria[] = []

    if (filtr.dateTestStart !== '' && filtr.dateTestEnd !== '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'dateTest'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = format(filtr.dateTestStart, 'yyyy-MM-dd') + " AND " + format(filtr.dateTestEnd, 'yyyy-MM-dd')
        criteriaList.push(dateCriteria)
    }

    if (filtr.id > 0) {
        const id = new SearchCriteria();
        id.key = 'id'
        id.operation = ':'
        id.value = filtr.id.toString()
        criteriaList.push(id)
    }
    if (filtr.testPass !== TestPass.ALL_) {
        const id = new SearchCriteria();
        id.key = 'testPass'
        id.operation = ':'
        id.value = filtr.testPass.toString()
        criteriaList.push(id)
    }

    if(filtr.userCol.length > 0){
        filtr.userCol.forEach(user=>{
            const userCriteria = new SearchCriteria();
            userCriteria.key = 'agent'
            userCriteria.operation = ':'
            userCriteria.value = user.id.toString();
            criteriaList.push(userCriteria)
        })
    }
    console.log('criteriaList TEST:', criteriaList);
    return criteriaList;

}

export function createSearchCriteriaByFiltrFeedback(filtr: FiltrFeedback) {

    const criteriaList: SearchCriteria[] = []

    if (filtr.dateFeedbackStart !== '' && filtr.dateFeedbackEnd !== '') {
        const dateCriteria = new SearchCriteria();
        dateCriteria.key = 'dateFeedback'
        dateCriteria.operation = 'BETWEEN'
        dateCriteria.value = format(filtr.dateFeedbackStart, 'yyyy-MM-dd') + " AND " + format(filtr.dateFeedbackEnd, 'yyyy-MM-dd')
        criteriaList.push(dateCriteria)
    }

    if (filtr.id > 0) {
        const id = new SearchCriteria();
        id.key = 'id'
        id.operation = ':'
        id.value = filtr.id.toString()
        criteriaList.push(id)
    }
    if (filtr.feedback !== Feedback_type.ALL_) {
        const id = new SearchCriteria();
        id.key = 'testPass'
        id.operation = ':'
        id.value = filtr.feedback.toString()
        criteriaList.push(id)
    }

    if(filtr.userCol.length > 0){
        filtr.userCol.forEach(user=>{
            const userCriteria = new SearchCriteria();
            userCriteria.key = 'agent'
            userCriteria.operation = ':'
            userCriteria.value = user.id.toString();
            criteriaList.push(userCriteria)
        })
    }
    console.log('criteriaList FEEDBACK:', criteriaList);
    return criteriaList;

}
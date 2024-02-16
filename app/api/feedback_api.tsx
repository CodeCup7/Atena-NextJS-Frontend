// '==========================================================================================================================================
// '*********************** Feedback API *****************************************************************************************************
// '==========================================================================================================================================
import { Feedback } from "../classes/feedback";
import { SearchCriteria } from "../classes/filtrs/searchCriteria";

interface Foo {
    callback: string;
    isOK: boolean;
    feedback: Feedback;
}

export async function api_Feedback_add(feedback: Feedback): Promise<Foo> {
    try {
        const response = await fetch('http://localhost:8080/api/feedback/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedback)
        });

        if (response.ok) {
            const addedFeedback = await response.json();
            return { callback: 'Feedback został dodany', isOK: true, feedback: addedFeedback };
        } else {
            return { callback: 'Feedback nie został dodany ' + response, isOK: false, feedback: feedback };
        }
    } catch (error) {
        return { callback: 'Błąd dodawania feedbacku ' + error, isOK: false, feedback: feedback };
    }
}

export async function api_Feedback_getDate(startDate: string, endDate: string): Promise<Feedback[]> {
    try {
        const response = await fetch(`http://localhost:8080/api/feedback/getAllFeedbackDates/${startDate}/${endDate}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function api_Feedback_search(searchCriteria: SearchCriteria[]): Promise<Feedback[]> {
    try {
        const response = await fetch('http://localhost:8080/api/feedback/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchCriteria)
        });

        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function api_Feedback_delete(feedback: Feedback): Promise<Foo> {
    try {
        const response = await fetch(`http://localhost:8080/api/feedback/delete/${feedback.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedback),
        });

        if (response.ok) {
            return { callback: 'Feedback został usunięty', isOK: true, feedback: feedback };
        } else {
            return { callback: 'Feedback nie został usunięty ' + response, isOK: false, feedback: feedback };
        }
    } catch (error) {
        return { callback: 'Błąd usuwania feedbacku ' + error, isOK: false, feedback: feedback };
    }
}
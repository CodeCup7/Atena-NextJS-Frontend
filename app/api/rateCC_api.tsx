// '==========================================================================================================================================
// '*********************** RateCC API *******************************************************************************************************
// '==========================================================================================================================================
import { RateCC } from "../classes/rates/rateCC";
import { SearchCriteria } from "../classes/filtrs/searchCriteria";

interface Foo {
    callback: string;
    isOK: boolean;
    rateCC: RateCC
}

export async function api_rateCC_add(rateCC: RateCC): Promise<Foo> {

    try {
        const response = await fetch('http://localhost:8080/api/rateCC/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateCC)
        });

        if (response.ok) {
            const addedRateCC = await response.json();
            return { callback: 'Ocena została dodana', isOK: true, rateCC: addedRateCC };
        } else {
            return { callback: 'Ocena nie została dodana ' + response, isOK: false, rateCC: new RateCC() };
        }
    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateCC: rateCC };
    }
}

export async function api_rateCC_update(rateCC: RateCC): Promise<Foo> {

    try {
        const response = await fetch('http://localhost:8080/api/rateCC/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateCC)
        });

        if (response.ok) {
            return { callback: 'Ocena została edytowana', isOK: true, rateCC: rateCC };
        } else {
            return { callback: 'Ocena nie została edytowana ' + response, isOK: false, rateCC: rateCC };
        }

    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateCC: rateCC };
    }
}

export async function api_rateCC_updateList(rateList: RateCC[], noteId: number): Promise<Foo> {

    try {
        const response = await fetch('http://localhost:8080/api/rateCC/updateList/' + noteId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateList)
        });

        if (response.ok) {
            return { callback: 'Lista ocen została pomyślnie zaaktualizowana', isOK: true, rateCC: new RateCC() };

        } else {
            return { callback: 'Lista ocen nie została zaktualizowana ' + response, isOK: false, rateCC: new RateCC() };
        }
    } catch (error) {
        return { callback: 'Błąd aktualizacji ocen ' + error, isOK: false, rateCC: new RateCC() };
    }
}

export async function api_rateCC_deleteList(rateList: RateCC[]): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, rateCC: new RateCC() };

        const response = await fetch('http://localhost:8080/api/rateCC/deleteList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateList)
        });

        if (response.ok) {
            return { callback: 'Lista ocen została pomyślnie zaaktualizowana', isOK: true, rateCC: new RateCC() };

        } else {
            return { callback: 'Lista ocen nie została zaktualizowana ' + response, isOK: false, rateCC: new RateCC() };
        }
    } catch (error) {
        return { callback: 'Błąd aktualizacji ocen ' + error, isOK: false, rateCC: new RateCC() };
    }
}

export async function api_rateCC_delete(id: Number): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, rateCC: new RateCC() };

        const response = await fetch('http://localhost:8080/api/rateCC/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return { callback: 'Ocena została pomyślnie usunięta', isOK: true, rateCC: new RateCC() };

        } else {
            return { callback: 'Ocena nie została pomyślnie usunięta ' + response, isOK: false, rateCC: new RateCC() };
        }
    } catch (error) {
        return { callback: 'Błąd usuwania oceny ' + error, isOK: false, rateCC: new RateCC() };
    }
}

export async function api_rateCC_search(searchCriteria: SearchCriteria[]): Promise<RateCC[]> {
    
    try {
        const response = await fetch('http://localhost:8080/api/rateCC/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchCriteria)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        return await response.json();

    } catch (error) {
        console.error('Error during API call:', error);
        return [];
    }
}

export async function api_rateCC_getById(id: number): Promise<RateCC> {
    
    try {
        const response = await fetch('http://localhost:8080/api/rateCC/getById/' + id);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error during API call:', error);
        return new RateCC();
    }
}

export async function api_rateCC_getAllRateNoNote(): Promise<RateCC[]> {
    
    try {
        
        const response = await fetch('http://localhost:8080/api/rateCC/getAllRateNoNote');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();

    } catch (error) {
        console.error('Error during API call:', error);
        return [];
    }
}
export async function api_rateCC_getAllRateNoNoteByAgent(agentId: number): Promise<RateCC[]> {
    
    try {
        
        const response = await fetch('http://localhost:8080/api/rateCC/getAllRateNoNoteByAgent/' + agentId);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const rateList: Array<RateCC> = await response.json();

        return rateList;
        
    } catch (error) {
        console.error('Error during API call:', error);
        return [];
    }
}

export async function api_rateCC_export(rateCC: RateCC): Promise<void> {

    try {
        const response = await fetch('http://localhost:8080/api/rateCC/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateCC)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = rateCC.id + '_Ocena_eksport.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } catch (error) {
        console.error('Error during API call:', error);
    }

}

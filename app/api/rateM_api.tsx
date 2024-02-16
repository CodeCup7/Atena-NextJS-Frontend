// '==========================================================================================================================================
// '*********************** RateM API *******************************************************************************************************
// '==========================================================================================================================================
import { RateM } from "../classes/rates/rateM";
import { SearchCriteria } from "../classes/filtrs/searchCriteria";

interface Foo {
    callback: string;
    isOK: boolean;
    rateM: RateM
}

export async function api_rateM_add(rateM: RateM, attachment: File): Promise<Foo> {
    
    try {
        const formData = new FormData();
        formData.append('rateM', JSON.stringify(rateM));
        formData.append('file', attachment);

        const response = await fetch('http://localhost:8080/api/rateM/add', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const addedRateCC = await response.json();
            return { callback: 'Ocena została dodana', isOK: true, rateM: addedRateCC };
        } else {
            return { callback: 'Ocena nie została dodana', isOK: false, rateM: new RateM() };
        }
    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateM: new RateM() };
    }
}
export async function api_rateM_update(rateM: RateM, attachment?: File | null): Promise<Foo> {

    try {
        const formData = new FormData();
        formData.append('rateM', JSON.stringify(rateM));
        if (attachment != null) {
            formData.append('file', attachment);
        }

        const response = await fetch('http://localhost:8080/api/rateM/update', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            return { callback: 'Ocena została edytowana', isOK: true, rateM: rateM };
        } else {
            return { callback: 'Ocena nie została edytowana', isOK: false, rateM: new RateM() };
        }

    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateM: new RateM() };
    }
}

export async function api_rateM_updateList(rateList: RateM[], noteId: number): Promise<Foo> {

    try {
        const response = await fetch('http://localhost:8080/api/rateM/updateList/' + noteId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rateList)
        });

        if (response.ok) {
            return { callback: 'Lista ocen została pomyślnie zaaktualizowana', isOK: true, rateM: new RateM() };

        } else {
            return { callback: 'Lista ocen nie została zaktualizowana', isOK: false, rateM: new RateM() };
        }
    } catch (error) {
        return { callback: 'Błąd aktualizacji ocen ' + error, isOK: false, rateM: new RateM() };
    }
}

export async function api_rateM_deleteList(rateList: RateM[]): Promise<Foo> {

        try {
            const response = await fetch('http://localhost:8080/api/rateM/deleteList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rateList)
            });

            if (response.ok) {
                return { callback: 'Lista ocen została pomyślnie zaaktualizowana', isOK: true, rateM: new RateM() };
    
            } else {
                return { callback: 'Lista ocen nie została zaktualizowana ' + response, isOK: false, rateM: new RateM() };
            }
        } catch (error) {
            return { callback: 'Błąd aktualizacji ocen ' + error, isOK: false, rateM: new RateM() };
        }
    }

    export async function api_rateM_delete(id: Number): Promise<Foo> {

        try {
            let foo: Foo = { callback: '', isOK: false, rateM: new RateM() };
    
            const response = await fetch('http://localhost:8080/api/rateM/delete/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                return { callback: 'Ocena została pomyślnie usunięta', isOK: true, rateM: new RateM() };
    
            } else {
                return { callback: 'Ocena nie została pomyślnie usunięta ' + response, isOK: false, rateM: new RateM() };
            }
        } catch (error) {
            return { callback: 'Błąd usuwania oceny ' + error, isOK: false, rateM: new RateM() };
        }
    }

    export async function api_rateM_search(searchCriteria: SearchCriteria[]): Promise<RateM[]> {

        try {
            const response = await fetch('http://localhost:8080/api/rateM/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchCriteria)
            });

            return await response.json();
        } catch (error) {
            console.error('Error during API call:', error);
            return [];
        }
    }

    export async function api_rateM_getById(id: number): Promise<RateM> {
        
        try {
            const response = await fetch('http://localhost:8080/api/rateM/getById/' + id);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error during API call:', error);
            return new RateM();
        }
    }

    export async function api_rateM_getAllRateNoNote(): Promise<RateM[]> {
        
        try {
            
            const response = await fetch('http://localhost:8080/api/rateM/getAllRateNoNote');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rateList: Array<RateM> = await response.json();

            return rateList;
        } catch (error) {
            console.error('Error during API call:', error);
            return [];
        }
    }

    export async function api_rateM_getAllRateNoNoteByAgent(agentId: number): Promise<RateM[]> {
       
        try {
            const response = await fetch('http://localhost:8080/api/rateM/getAllRateNoNoteByAgent/' + agentId);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rateList: Array<RateM> = await response.json();

            return rateList;
        } catch (error) {
            console.error('Error during API call:', error);
            return [];
        }
    }

    export async function api_rateM_getAttachment(fileName: string): Promise<File> {

        const response = await fetch(`http://localhost:8080/api/rateM/getAttachment?fileName=${encodeURIComponent(fileName)}`);

        const blob = await response.blob();
        const file = new File([blob], fileName);

        return file;

    }

    export async function api_rateM_downloadAttachment(fileName: string) {
        window.location.href = `http://localhost:8080/api/rateM/getAttachment?fileName=${encodeURIComponent(fileName)}`;
    }

    export async function api_rateM_export(rateM: RateM): Promise<void> {
        console.log(JSON.stringify(rateM))
        try {
            const response = await fetch('http://localhost:8080/api/rateM/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rateM)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = rateM.id + '_Ocena_Mail_eksport.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Błąd pobierania danych:', error);
        }
    }

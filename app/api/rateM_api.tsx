// '==========================================================================================================================================
// '*********************** RateM API *******************************************************************************************************
// '==========================================================================================================================================

import { RateM } from "../classes/rateM";
import { SearchCriteria } from "../classes/searchCriteria";

interface Foo {
    callback: string;
    isOK: boolean;
    rateM: RateM
}

export async function api_rateM_add(rateM: RateM, attachment: File): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, rateM: rateM };

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
            const addedRateM = await response.json(); // Pobierz zaktualizowany obiekt z odpowiedzi
            foo.callback = 'Ocena została dodana';
            foo.isOK = true;
            foo.rateM = addedRateM;
        } else {
            foo.callback = 'Ocena nie została dodana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateM: rateM };
    }
}

export async function api_rateM_update(rateM: RateM, attachment?: File | null): Promise<Foo> {

    try {
        let foo: Foo = { callback: '', isOK: false, rateM: rateM };

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
            foo.callback = 'Ocena została edytowana';
            foo.isOK = true;
        } else {
            foo.callback = 'Ocena nie została edytowana';
            foo.isOK = false;
        }
        return foo;
    } catch (error) {
        return { callback: 'Błąd dodawania oceny ' + error, isOK: false, rateM: rateM };
    }
}

export async function api_RateM_search(searchCriteria: SearchCriteria[]): Promise<RateM[]> {

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
        console.error('Błąd pobierania ocen RateM:', error);
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
        console.error('Błąd pobierania ocen RateM:', error);
        return [];
    }
}

export async function api_rateM_getAttachment(fileName: string): Promise<File> {
    console.log('fileName :', fileName);

    const response = await fetch(`http://localhost:8080/api/rateM/getAttachment?fileName=${encodeURIComponent(fileName)}`);

    const blob = await response.blob();
    const file = new File([blob], fileName);

    return file;

}

export async function api_rateM_downloadAttachment(fileName: string) {
    window.location.href = `http://localhost:8080/api/rateM/getAttachment?fileName=${encodeURIComponent(fileName)}`;
}
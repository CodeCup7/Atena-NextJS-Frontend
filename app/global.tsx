//================================================================
//*********************** Global Varible *************************
//================================================================
import { api_UserList_getByLogin } from "./api/user_api";
import { User } from "./classes/user";

export const app_name: String = "Atena";
export const app_version: String = "0.0.1";

export async function getActiveUser(login: string): Promise<User> {

    const activeUser: User = new User();

    try {
        const activeUser = await api_UserList_getByLogin(login);
        return activeUser;
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
    }

    return activeUser;
}


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

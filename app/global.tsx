//================================================================
//*********************** Global Varible *************************
//================================================================
import { Role, User } from "./classes/user";
import { global_userList } from "./factory/factory_user";

export const app_name: String = "Atena";
export const app_version: String = "0.0.1";

let activeUser: User = global_userList.find(user => user.nameUser = "Szymon") || new User();

export function setActiveUser() {
    activeUser = global_userList.find(user => user.nameUser = "Szymon") || new User();
}

export function getActiveUser(): User {
    let activeUser: User = global_userList.find(user => user.nameUser = "Szymon") || new User();
    return activeUser;
}

export function getActiveUserRole(): Role | null {
    if (activeUser.role !== undefined) {
        return activeUser.role;
    }
    return null;
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

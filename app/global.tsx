//================================================================
//*********************** Global Varible *************************
//================================================================
import { Role, User } from "./classes/user";
import { userList_ } from "./factory/factory_user";

export const app_name: String = "Atena";
export const app_version: String = "0.0.1";

let activeUser: User = userList_.find(user => user.nameUser = "Ares") || new User();

export function setActiveUser() {
    activeUser = userList_.find(user => user.nameUser = "Ares") || new User();
}


export function getActiveUser(): User {
    return activeUser;
}

export function getActiveUserRole(): Role {
    return activeUser.role;
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

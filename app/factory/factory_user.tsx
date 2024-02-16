// '==========================================================================================================================================
// '*********************** User Factory *****************************************************************************************************
// '==========================================================================================================================================
import { api_UserList_getAll } from "../api/user_api";
import { User } from "../classes/user";
import { Role } from "../classes/user";

export function CreateNewEmptyUser() {

    let user = new User();
    return user;

}
export function CreateUser(id: number, login: string, nameUser: string, role: Role, available: boolean, coachId: number, bossId: number, leaderId: number, comments: string, mail: string) {

    let user = new User();
    user.id = id;
    user.login = login;
    user.nameUser = nameUser;
    user.role = role;
    user.available = available;
    user.coachId = coachId;
    user.bossId = bossId;
    user.leaderId = leaderId;
    user.mail = mail;

    return user;

}

export let global_userList: User[] = [];

export async function updateUserList() {
    try {
        global_userList = await api_UserList_getAll();
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
    }

    return global_userList
}

// # TEMP USER LIST #

// const admin1 = CreateUser(1, "", "Szymo", Role.ADMIN_, true, 0, 0, 0, "", "");
// const admin2 = CreateUser(2, "", "Szymon", Role.ADMIN_, true, 0, 0, 0, "", "");

// const kiero = CreateUser(3, "", "Boss1", Role.BOSS_, true, 0, 0, 0, "", "");
// const kiero2 = CreateUser(4, "", "Boss2", Role.BOSS_, true, 0, 0, 0, "", "");

// const coach1 = CreateUser(5, "", "Coach1", Role.COACH_, true, 0, 0, 0, "", "");
// const coach2 = CreateUser(6, "", "Coach2", Role.COACH_, true, 0, 0, 0, "", "");

// const leader1 = CreateUser(7, "", "Leader1", Role.LEADER_, true, 0, 0, 0, "", "");
// const leader2 = CreateUser(8, "", "Leader2", Role.LEADER_, true, 0, 0, 0, "", "");

// const user1 = CreateUser(9, "", "user1", Role.ADMIN_, true, 1, 3, 7, "", "");
// const user2 = CreateUser(10, "", "user2", Role.AGENT_, true, 1, 3, 7, "", "");
// const user3 = CreateUser(11, "", "user3", Role.AGENT_, true, 1, 3, 7, "", "");
// const user4 = CreateUser(12, "", "user4", Role.AGENT_, true, 1, 3, 7, "", "");
// const user5 = CreateUser(13, "", "user5", Role.AGENT_, true, 1, 4, 7, "", "");
// const user6 = CreateUser(14, "", "user6", Role.AGENT_, true, 1, 4, 7, "", "");
// const user7 = CreateUser(15, "", "user7", Role.AGENT_, true, 1, 4, 7, "", "");
// const user8 = CreateUser(16, "", "user8", Role.AGENT_, true, 2, 4, 7, "", "");
// const user9 = CreateUser(17, "", "user9", Role.AGENT_, true, 2, 4, 7, "", "");
// const user10 = CreateUser(18, "", "user10", Role.AGENT_, true, 2, 3, 8, "", "");
// const user11 = CreateUser(19, "", "user11", Role.AGENT_, true, 2, 3, 8, "", "");
// const user12 = CreateUser(20, "", "user12", Role.AGENT_, true, 2, 3, 8, "", "");
// const user13 = CreateUser(21, "", "user13", Role.AGENT_, true, 2, 3, 8, "", "");
// const user14 = CreateUser(22, "", "user14", Role.AGENT_, true, 5, 4, 8, "", "");
// const user15 = CreateUser(23, "", "user15", Role.AGENT_, true, 5, 3, 8, "", "");
// const user16 = CreateUser(24, "", "user16", Role.AGENT_, true, 5, 4, 8, "", "");
// const user17 = CreateUser(25, "", "user17", Role.AGENT_, true, 6, 3, 8, "", "");
// const user18 = CreateUser(26, "", "user18", Role.AGENT_, true, 6, 4, 8, "", "");
// const user19 = CreateUser(27, "", "user19", Role.AGENT_, true, 6, 3, 8, "", "");
// const user20 = CreateUser(28, "", "user20", Role.AGENT_, true, 6, 4, 8, "", "");


// userList_.push(admin1, admin2, user1, user2, user3, user4, user5, user6, user7,
//     user8, user9, admin1, admin2, kiero, kiero2, coach1, coach2, leader1, leader2,
//     user10, user11, user12, user13, user14, user15, user16, user17, user18, user19, user20
// );
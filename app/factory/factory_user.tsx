import { User } from "../classes/user";
import { Role } from "../classes/user";

export function CreateNewEmptyUser() {

    let user = new User();
    return user;

}
export function CreateUser(id: number, login: string, nameUser: string, role: Role, available: boolean, area: string, coachId: number, bossId: number, leaderId: number, comments: string, mail: string) {

    let user = new User();
    user.$id = id;
    user.$login = login;
    user.$nameUser = nameUser;
    user.$role = role;
    user.$available = available;
    user.$area = area;
    user.$coachId = coachId;
    user.$bossId = bossId;
    user.$leaderId = leaderId;
    user.$comments = comments;
    user.$mail = mail;

    return user;

}

export let userList_: User[] = [];

const admin1 = CreateUser(1, "", "Szymon Admin", Role.ADMIN_, true, "", 0, 0, 0, "", "");
const admin2 = CreateUser(12, "", "Szymon Admin2", Role.ADMIN_, true, "", 0, 0, 0, "", "");

const user1 = CreateUser(20, "", "1_Szymon", Role.ADMIN_, true, "", 1, 11, 0, "", "");
const user2 = CreateUser(30, "", "2_Szymon", Role.AGENT_, true, "", 1, 13, 0, "", "");
const user3 = CreateUser(40, "", "3_Szymon", Role.AGENT_, true, "", 1, 11, 0, "", "");
const user4 = CreateUser(50, "", "4_Szymon", Role.AGENT_, true, "", 1, 13, 0, "", "");
const user5 = CreateUser(60, "", "5_Szymon", Role.AGENT_, true, "", 1, 11, 0, "", "");
const user6 = CreateUser(70, "", "6_Szymon", Role.AGENT_, true, "", 1, 13, 0, "", "");
const user7 = CreateUser(80, "", "7_Szymon", Role.AGENT_, true, "", 12, 11, 0, "", "");
const user8 = CreateUser(90, "", "8_Szymon", Role.AGENT_, true, "", 12, 13, 0, "", "");
const user9 = CreateUser(100, "", "9_Szymon", Role.AGENT_, true, "", 12, 11, 0, "", "");

const kiero = CreateUser(11, "", "Szymon Kiero", Role.ADMIN_, true, "", 0, 0, 0, "", "");
const kiero2 = CreateUser(13, "", "Szymon Kiero", Role.ADMIN_, true, "", 0, 0, 0, "", "");

userList_.push(user1, user2, user3, user4, user5, user6, user7, user8, user9, admin1, admin2, kiero, kiero2);
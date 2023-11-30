import { User } from "../classes/user";
import { Role } from "../classes/user";

export function CreateNewEmptyUser() {

    let user = new User();
    return user;

}
export function CreateUser(id: number, login: string, nameUser: string, role: Role, available: boolean, area: string, coachId: number, bossId: number, leaderId: number, comments: string, mail: string) {

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

export let userList_: User[] = [];

const admin1 = CreateUser(1, "", "Ares", Role.ADMIN_, true, "", 0, 0, 0, "", "");
const admin2 = CreateUser(12, "", "Szymon Admin2", Role.ADMIN_, true, "", 0, 0, 0, "", "");

const user1 = CreateUser(20, "", "1_Szymon", Role.ADMIN_, true, "", 1, 11, 4, "", "");
const user2 = CreateUser(30, "", "2_Szymon", Role.AGENT_, true, "", 1, 13, 5, "", "");
const user3 = CreateUser(40, "", "3_Szymon", Role.AGENT_, true, "", 1, 11, 4, "", "");
const user4 = CreateUser(50, "", "4_Szymon", Role.AGENT_, true, "", 1, 13, 5, "", "");
const user5 = CreateUser(60, "", "5_Szymon", Role.AGENT_, true, "", 1, 11, 4, "", "");
const user6 = CreateUser(70, "", "6_Szymon", Role.AGENT_, true, "", 1, 13, 5, "", "");
const user7 = CreateUser(80, "", "7_Szymon", Role.AGENT_, true, "", 12, 11, 4, "", "");
const user8 = CreateUser(90, "", "8_Szymon", Role.AGENT_, true, "", 3, 13, 5, "", "");
const user9 = CreateUser(100, "", "9_Szymon", Role.AGENT_, true, "", 2, 11, 4, "", "");

const kiero = CreateUser(11, "", "Szymon BIOSS", Role.BOSS_, true, "", 0, 0, 5, "", "");
const kiero2 = CreateUser(13, "", "Szymon BIOSS", Role.BOSS_, true, "", 0, 0, 4, "", "");

const coach1 = CreateUser(2, "", "Szymon COACCH", Role.COACH_, true, "", 0, 0, 0, "", "");
const coach2 = CreateUser(3, "", "Szymon COACCH", Role.COACH_, true, "", 0, 0, 0, "", "");

const leader1 = CreateUser(4, "", "Szymon LEADER", Role.LEADER_, true, "", 0, 0, 0, "", "");
const leader2 = CreateUser(5, "", "Szymon LEADER", Role.LEADER_, true, "", 0, 0, 0, "", "");

userList_.push(admin1, admin2, user1, user2, user3, user4, user5, user6, user7, user8, user9, admin1, admin2, kiero, kiero2, coach1, coach2, leader1, leader2);
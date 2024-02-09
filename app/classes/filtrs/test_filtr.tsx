// '===============================================================
// '******************** Filtr Test CLASS *************************
// '===============================================================

import { TestPass } from "../test";
import { User } from "../user";

export class FiltrTest {

    public id: number = 0;
    public dateTestStart: string = "";
    public dateTestEnd: string = "";
    public testPass: TestPass = TestPass.ALL_;

    public userCol: Array<User> = [];
}

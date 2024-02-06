// '========================================================
// '*********************** Feedback CLASS *****************
// '========================================================
import { User } from "./user";

export enum TestsPass {
    ALL_ = "ALL_",
    NO_REQUIRED_ = "NO_REQUIRED_",
    PASS_ = "PASS_",
    NO_PASS_ = "NO_PASS_",
}

export const TestsLabels: Record<TestsPass, string> = {
    [TestsPass.ALL_]: "Wszystkie",
    [TestsPass.NO_REQUIRED_]: "Nie wymagany",
    [TestsPass.PASS_]: "Zdany",
    [TestsPass.NO_PASS_]: "Nie zdany",
};

export class Tests {
    public id: number = 0;
    public agent: User = new User();
    public dateTest: string = "";
    public score: number = 0;
    public progress: string = "";
    public levelPass: number = 0;
    public testPass: TestsPass = TestsPass.ALL_;
    
}


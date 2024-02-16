// '========================================================
// '*********************** TEST CLASS *********************
// '========================================================
import { User } from "./user";

export enum TestPass {
    ALL_ = "ALL_",
    NO_REQUIRED_ = "NO_REQUIRED_",
    PASS_ = "PASS_",
    NO_PASS_ = "NO_PASS_",
}

export const TestLabels: Record<TestPass, string> = {
    [TestPass.ALL_]: "Wszystkie",
    [TestPass.NO_REQUIRED_]: "Nie wymagany",
    [TestPass.PASS_]: "Zdany",
    [TestPass.NO_PASS_]: "Nie zdany",
};

export class Test {
    public id: number = 0;
    public agent: User = new User();
    public dateTest: string = "";
    public score: number = 0;
    public progress: string = "";
    public levelPass: number = 0;
    public testPass: TestPass = TestPass.ALL_;
    
}


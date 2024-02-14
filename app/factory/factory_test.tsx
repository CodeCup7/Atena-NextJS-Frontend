// '==========================================================================================================================================
// '*********************** Tests Factory ****************************************************************************************************
// '==========================================================================================================================================
import { Test, TestPass } from '../classes/test';
import { User } from '../classes/user';

export function prepareTestsList(data: string[][], userList: User[]) {

    // Załadowanie danych z excela do listy
    const testList: Test[] = [];

    data.slice(1).forEach(row => {
        const test = new Test();

        test.agent = userList.find(user => user.login === row[0]) || new User();
        test.score = parseInt(row[1])
        test.levelPass = parseInt(row[2])
        test.progress = row[3]
        test.dateTest = row[4]

        if (row[5] === 'Nierozpoczęte') {
            test.testPass = TestPass.NO_REQUIRED_

        } else {
            if (test.levelPass > test.score) {
                test.testPass = TestPass.NO_PASS_
            } else {
                test.testPass = TestPass.PASS_
            }
        }

        testList.push(test);
    });

    return testList
}

export function getScore_Test(test: Test): number {

    let score = 0;

    if (test.testPass !== TestPass.NO_REQUIRED_) {

        if (test.levelPass = 95) { // Próg 95
            test.score >= 95 ? score = 0.1 : score = - 0.1
        } else if (test.levelPass === 80) { // Próg 80
            if (test.score >= 80 && test.score <= 90) {
                score = 0.05
            } else if (test.score > 90) {
                score = 0.1
            } else {
                score = -0.1
            }
        }
    }
    return score;
}



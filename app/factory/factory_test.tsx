// '==========================================================================================================================================
// '*********************** Tests Factory ****************************************************************************************************
// '==========================================================================================================================================
import { api_Test_add, api_Test_addAll } from '../api/test_api';
import { Test, TestPass } from '../classes/test';
import { User } from '../classes/user';

export async function uploadTestsFromExcel(data: string[][], userList: User[]) {

    // Załadowanie danych z excela do listy
    const testList:Test[] = [];

    data.slice(1).forEach(row => {
        const test = new Test();

        test.agent = userList.find(user => user.login === row[0]) || new User();
        test.score = parseInt(row[1])
        test.levelPass = parseInt(row[2])
        test.progress = row[3]
        test.dateTest = row[4]

        if (test.levelPass > test.score) {
            test.testPass = TestPass.NO_PASS_
        } else if (row[5] === 'Nierozpoczęte') {
            test.testPass = TestPass.NO_REQUIRED_
        } else {
            test.testPass = TestPass.PASS_
        }
        testList.push(test);
    });

    // Załądowanie testów do BD
    //api_Test_addAll(testList)
    console.log



}
// '==========================================================================================================================================
// '*********************** Tests Factory ****************************************************************************************************
// '==========================================================================================================================================
import { Test, TestPass } from '../classes/test';
import { User } from '../classes/user';


export async function uploadTestsFromExcel(data: string[][], userList: User[]) {
console.log('userList :', userList);

    const testList = Array<Test>();

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

    console.log('testList :', testList);

}
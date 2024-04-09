import { User } from "./classes/user";

//const login = 'adamjabłoński';
const login = 'demo';

let activeUser: User | null = null;

export async function getActiveUser(): Promise<User> {
    try {
        if (activeUser) {
            return activeUser;
        } else {

            const response = await fetch(`http://localhost:8080/api/user/getUserLogin/${login}`);
            
            if (!response.ok) {
                console.log('Error: ', response.status);
                throw new Error('Network response was not ok');
            }
            const userData = await response.json();
            sessionStorage.setItem('activeuser', JSON.stringify(userData));
            activeUser = userData as User;
            return userData as User;
        }
    } catch (error) {

        return new User();
    }
}
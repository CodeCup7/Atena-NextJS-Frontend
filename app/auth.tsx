import { User } from "./classes/user";

//const login = 'adamjabłoński';
const login = 'demo';

export async function getActiveUser(): Promise<User> {
    try {
        const response = await fetch(`http://localhost:8080/api/user/getUserLogin/${login}`, {
            cache: 'force-cache', // Ustawienie pamięci podręcznej na 'force-cache'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        return new User();
    }
}
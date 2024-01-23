import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getActiveUser } from '@/app/auth';
import { User } from '@/app/classes/user';
import { api_UserList_getByLogin } from '@/app/api/user_api';

// Tworzymy kontekst dla użytkownika
const UserContext = createContext<User | undefined>(undefined);
const login = 'Admin';

// Tworzymy komponent dostarczający kontekst użytkownika
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeUser, setActiveUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await api_UserList_getByLogin(login);
                setActiveUser(user);
            } catch (error) {
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, []);

    return <UserContext.Provider value={activeUser}>{children}</UserContext.Provider>;
};

// Tworzymy hook, który można użyć do pobierania kontekstu użytkownika
export const useUser = (): User | undefined => {
    const user = useContext(UserContext);
    if (user === undefined) {
        console.warn('Używasz useUser poza dostarczonym UserProvider');
    }
    return user;
};

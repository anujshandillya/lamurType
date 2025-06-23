import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";
import { type ProviderState } from "./types";

const UserAuthContext = createContext<ProviderState>({} as ProviderState);

export default function UserAuthProvider({children}: {children: React.ReactNode}) {
    const [userState, dispatch] = useReducer(reducer, {
        _id: null,
        email: null,
        first_name: null,
        last_name: null,
        isAuthenticated: false
    })

    useEffect(() => {
        if(typeof window !== undefined) {
            const user = window.localStorage.getItem('user') || null;

            if(user) dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
            else dispatch({ type: 'LOGOUT' });
        }
    }, [])
    return (
        <UserAuthContext.Provider value={{user: userState, dispatch}}>
            {children}
        </UserAuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(UserAuthContext);
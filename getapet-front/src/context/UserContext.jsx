import { createContext } from "react";

// hook
import useAuth from "../hooks/useAuth"

const Context = createContext()

function UserProvider({children}){

    const {register, authenticated, logout, login} = useAuth()

    return (
        <Context.Provider value={{register, authenticated, logout, login}}>
            {children}
        </Context.Provider>
    )

}

export {Context, UserProvider}
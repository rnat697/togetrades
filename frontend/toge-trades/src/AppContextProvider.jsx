import React from "react";
import useGet from "./hooks/useGet";
import { useLocalStorage } from "./hooks/useLocalStorage";

export const AppContext = React.createContext({});


export function AppContextProvider({ children }) {

    // Because we need this data pretty much everywhere in our app, it's a good idea
    // to load it in here, rather than having to make new GET requests every time we change the page.
    //FIXME: Lab 4 exercise 2
    const context = {}

    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}
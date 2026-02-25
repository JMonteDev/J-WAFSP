import  { createContext, useState } from 'react';

export const LoginContext = createContext();

export default function LoginContextProvider (props) {
    const [loggedUser, setLoggedUser] = useState(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser');
        let user = '';
        if (loggedUserJSON) {
          user = JSON.parse(loggedUserJSON);
        }
        return user;
    });

    const [firstName, setFirstName] = useState();

    return(
        <LoginContext.Provider value={{loggedUser, setLoggedUser, firstName, setFirstName}}>
            {props.children}
        </LoginContext.Provider>
    );
}

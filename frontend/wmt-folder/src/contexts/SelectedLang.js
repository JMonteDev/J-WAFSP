import {createContext, useState, useEffect} from 'react';

export const SelectedLang = createContext();

export default function SelectedLangProvider (props) {
    const [selectedLang, setSelectedLang] = useState(() => {
        const localData = window.sessionStorage.getItem('selectedLang');
        return localData ? JSON.parse(localData) : "";                                         // GUARDA EL PASO ACTIVO EN EL MOMENTO
    });

    useEffect(() => {
        sessionStorage.setItem('selectedLang', JSON.stringify(selectedLang));
      }, [selectedLang]);

    return(
        <SelectedLang.Provider value={{selectedLang, setSelectedLang}}>
            {props.children}
        </SelectedLang.Provider>
    );
}



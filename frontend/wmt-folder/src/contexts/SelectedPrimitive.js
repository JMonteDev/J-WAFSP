import {createContext, useState} from 'react';

export const SelectedPrimitive = createContext();

export default function SelectedPrimitiveProvider (props) {
    const [selectedPrimitive, setSelectedPrimitive] = useState("");

    const [controlPrimitive, setControlPrimitive] = useState(0);

    return(
        <SelectedPrimitive.Provider value={{selectedPrimitive, setSelectedPrimitive, controlPrimitive, setControlPrimitive}}>
            {props.children}
        </SelectedPrimitive.Provider>
    );
}



import { createContext, useState } from 'react';

export const SelectedTab = createContext();

export default function SelectedTabProvider (props) {
    const [selectedTab, setSelectedTab] = useState(0);

    return(
        <SelectedTab.Provider value={{selectedTab, setSelectedTab}}>
            {props.children}
        </SelectedTab.Provider>
    );
}
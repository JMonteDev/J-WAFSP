import React, {useState, useEffect, useContext} from "react";
import { SelectedLang } from "../../../../contexts/SelectedLang";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
//import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "../StepStyle.scss";   

export default function SelectLang() {
    let [languages, setLanguages] = useState([]);
    const { setSelectedLang } = useContext(SelectedLang);

    async function getLanguages() {
        const response = await require('axios')
        .get("http://localhost:8000/LanguagesList/")
        .then(result => {
            //console.log(result.data);
            return (
                result.data.map( item => {
                    return (
                        {label: item['language']}
                    );
                })
            );
        });
        setLanguages(response);
        return;
    }

    useEffect(() => {
        getLanguages();
    }, []);
    
    return (
        <Autocomplete  
            disablePortal
            id="combo-box"
            options={languages}
            className="comboBox"
            onChange={(e) => {e.target.id ? setSelectedLang(languages[e.target.id.split("-")[3]]["label"]) : setSelectedLang("")}}
            defaultValue={ window.sessionStorage.getItem('selectedLang') ? JSON.parse(window.sessionStorage.getItem('selectedLang')) : "" } 
            renderInput={(params) => <TextField {...params} label="Project Languaje" />}
        />
    );
}
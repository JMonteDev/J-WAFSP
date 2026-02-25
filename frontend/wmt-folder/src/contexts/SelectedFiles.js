import {createContext, useState} from 'react';

export const SelectedFiles = createContext();

export default function SelectedFilesProvider (props) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [filename, setFilename] = useState('Protected Project.zip');
    const [errorsByFile, setErrorsByFile] = useState([]);
    const [loadingResponse, setLoadingResponse] = useState(true);

    function cleanAll() {
        setSelectedFiles([]);
        setDownloadUrl(null);
        setFilename('Protected Project.zip');
        setErrorsByFile([]);
        setLoadingResponse(true);
    }

    return(
        <SelectedFiles.Provider value={{selectedFiles, setSelectedFiles, downloadUrl, setDownloadUrl, filename, setFilename, errorsByFile, setErrorsByFile, loadingResponse, setLoadingResponse, cleanAll}}>
            {props.children}
        </SelectedFiles.Provider>
    );
}



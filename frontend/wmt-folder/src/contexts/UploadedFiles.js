import {createContext, useState, useEffect} from 'react';

export const UploadedFiles = createContext();

export default function UploadedFilesProvider (props) {
    const [willRenderFiles, setWillRenderFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState(() => {
        const localData = window.sessionStorage.getItem('uploadedFiles');
        return localData ? JSON.parse(localData) : [];                                         // GUARDA EL PASO ACTIVO EN EL MOMENTO
    });

    const [controlUpload, setControlUpload] = useState(0);

    function addFiles(file) {
        setUploadedFiles(uploadedFiles => {                 // ASI SE AGREGA A LA LISTA DE ARCHIVOS
            return [...uploadedFiles, file];
        });

        if (file.path === "") {
            setWillRenderFiles(willRenderFiles => {                 // ASI SE AGREGA A LA LISTA DE ARCHIVOS
                return [...willRenderFiles, file];
            });
        }
    }

    function changeVisibility(key){
        var itemAux = willRenderFiles[willRenderFiles.indexOf(willRenderFiles.filter(item=> item.key === key)[0])]
        if (willRenderFiles[willRenderFiles.indexOf(willRenderFiles.filter(item=> item.key === key)[0])].visibility) { // si esta visible la carpeta, le quito el contenido de la coleccion render y cambio su visibilidad
            setWillRenderFiles(willRenderFiles => { return willRenderFiles.filter(item => !item.path.includes(itemAux.path + itemAux.fileName + "/", 0))});
        } else {    // si no esta visible la carpeta, le agrego el contenido a la coleccion render desde la coleccion que tiene todos los archivos y cambio su visibilidad
            setWillRenderFiles(willRenderFiles => {return willRenderFiles.concat(uploadedFiles.filter(item => item.path === itemAux.path + itemAux.fileName + "/"))});
        }

        setWillRenderFiles(willRenderFiles => { return willRenderFiles[willRenderFiles.indexOf(willRenderFiles.filter(item=> item.key === key)[0])].visibility = !willRenderFiles[willRenderFiles.indexOf(willRenderFiles.filter(item=> item.key === key)[0])].visibility});
        console.log("este", willRenderFiles.concat(uploadedFiles.filter(item => item.path === itemAux.path + itemAux.fileName + "/")));
        
    }

    function deleteItem(key) {
        var itemAux = uploadedFiles[uploadedFiles.indexOf(uploadedFiles.filter(item=> item.key === key)[0])]
        if (itemAux.file){
            setUploadedFiles(uploadedFiles => { return uploadedFiles.filter(item => item !== itemAux)});        // elimino el archivo de la coleccion
            setWillRenderFiles(willRenderFiles => { return willRenderFiles.filter(item => item.key !== key)});  // elimino el archivo del render
        } else {
            console.log("eliminados", uploadedFiles.filter(item => !item.path.includes(itemAux.path + itemAux.fileName + "/", 0)));
            setUploadedFiles(uploadedFiles => { return uploadedFiles.filter(item => item.key !== key && !item.path.includes(itemAux.path + itemAux.fileName + "/", 0))});           // elimino la carpeta de la coleccion
            setWillRenderFiles(willRenderFiles => { return willRenderFiles.filter(item => item.key !== key && !item.path.includes(itemAux.path + itemAux.fileName + "/", 0))});     // elimino la carpeta del render
        }
        console.log("context", uploadedFiles);
    }

    function cleanStorage() {
        sessionStorage.setItem('uploadedFiles', "");
    }
    

    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const pathA = a.path.toUpperCase();
        const pathB = b.path.toUpperCase();
        
        let comparison = 0;
        if (pathA > pathB) {
            comparison = -1;
        } else if (pathA < pathB) {
            comparison = 1;
        }
        return comparison;
    }

    useEffect(() => {                                               // SE DISPARA CADA VEZ QUE SE AGREGA UN ARCHIVO O CARPETA
        const equals = (a, b) =>
            a.length === b.length &&
            a.every((v, i) => v === b[i]);

        if (!equals(willRenderFiles, willRenderFiles.sort(compare))) {
            setWillRenderFiles(willRenderFiles.sort(compare));
        }

    }, [willRenderFiles]);

    useEffect(() => {
      }, [uploadedFiles]);

    return(
        <UploadedFiles.Provider value={{uploadedFiles, willRenderFiles, changeVisibility, addFiles, deleteItem, cleanStorage, controlUpload, setControlUpload}}>
            {props.children}
        </UploadedFiles.Provider>
    );
}



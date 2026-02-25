import {useContext} from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Typography from '@mui/material/Typography';
import { UploadedFiles } from '../../../../contexts/UploadedFiles';
import { v4 as uuidv4 } from 'uuid';
import RenderFiles from './RenderFiles';

export default function UploadProject() {

  const { uploadedFiles, addFiles} = useContext(UploadedFiles);
  
  document.addEventListener("dragover", function(event) {                 // inhabilito el evento dragover por defecto del navegador
    event.preventDefault();
  });

  document.addEventListener("drop", function(event) {                     // inhabilito el evento drop por defecto del navegador
    event.preventDefault();
  });
  
  function fileTree(item, path) {                                 // funcion que desgloza el arbol de carpetas y archivos y obtiene el path de cada uno RECURSIVAMENTE
    
    path = path || "";                                            // CON ESTO SE VA ARMANDO EL PATH

    if (item.isFile) {                                            // SI ES ARCHIVO HAY QUE AGREGARLO A LA LISTA DE ARCHIVOS Y ES PUNTO DE PARADA DE LA FUNCION RECURSIVA
      item.file(function(file) {
        addFiles({fileName: file.name, path, file, key: uuidv4()});      // ASI SE AGREGA A LA LISTA DE ARCHIVOS
      });

    } else if (item.isDirectory) {

      var dirReader = item.createReader();
      dirReader.readEntries(function(entries) {
        
        addFiles({fileName: item.name, path, file: false, visibility: false, key: uuidv4()});         // ASI SE AGREGA A LA LISTA DE ARCHIVOS

        for (var i=0; i<entries.length; i++) {                    // SI ES CARPETA NO VACIA, SE GENERA LA RECURSIVIDAD LLAMANDO A LA FUNCION CON EL CONTENIDO DE LA CARPETA
          
          fileTree(entries[i], path + item.name + "/");
        }
      });
    }
  }
  
  function dropHandler(event) {                                                   // funcion que agrega el nuevo evento drop donde se toman los archivos dropeados para luego ser enviados a la API
    
    event.preventDefault();                                       // PARA QUE NO SE DISPARE SIN CONTENIDO    
    const items = event.dataTransfer.items;                       // ACA VIENEN LOS ARCHIVOS
    
    for (var i=0; i<items.length; i++) {                          // SE LEEN CON EL WEBKIT
      var item = items[i].webkitGetAsEntry();                              // webkitGetAsEntry is where the magic happens - Da la siguiente informacion: {isFile: true, isDirectory: false, name: 'Currículum-Vitae-de-Jose-Pedro-Montejano-Massa.pdf', fullPath: '/Currículum-Vitae-de-Jose-Pedro-Montejano-Massa.pdf', filesystem: DOMFileSystem}
      
      if (item) {                                 
        fileTree(item);                                           // SE LLAMA A LA FUNCION RECURSIVA QUE RECORRE LAS CARPETAS
      }
    }
  }

  return(
    <div  style={{
        width: "100%",
        flexDirection: "column", 
        display: "flex", 
        alignItems: "center",
      }}>
        <div onDrop={dropHandler} style={{
            borderRadius: "1rem",
            borderColor: "blue",
            borderStyle: "dashed",
            borderWidth: "2px",
            width: "60%",
            padding: "3% 10%",
            margin: "5% 10%", 
            flexDirection: "column", 
            display: "flex", }}>
            {uploadedFiles.length === 0 ? (<>
              <Typography sx={{color: "blue"}}>
                  <UploadFileIcon />
              </Typography>
              <Typography sx={{color: "gray"}}>
                  Click or drag file to this area to upload
              </Typography>
              <Typography sx={{color: "gray"}}>
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files.
              </Typography>
            </>) : (
              <RenderFiles />
            )}
        </div>
    </div>
  );}

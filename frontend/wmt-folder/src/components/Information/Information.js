import React, { useContext, useState, useEffect } from "react";
import { SelectedTab } from "../../contexts/SelectedTab";
import { Button, TextField, Container, Paper, Typography, Box, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import "./InformationStyle.scss";
import LoginService from "../../services/LoginService";
import UploadTechniqueModal from "./UploadTechniqueModal";
import LoadingCircularIndicator from "../../Utils/LoadingCircularIndicator";

export default function Information() {
    const [ newPrimitiveName, setNewPrimitiveName ] = useState("");
    const [ newPrimitiveDescription, setNewPrimitiveDescription ] = useState("");
    const [ newPrimitiveMessage, setNewPrimitiveMessage ] = useState("");
    const [ newPrimitiveClassName, setNewPrimitiveClassName ] = useState("");
    const [ newPrimitiveListenerFile, setNewPrimitiveListenerFile ] = useState(null);

    const [ newPrimitiveNameError, setNewPrimitiveNameError ] = useState("");
    const [ newPrimitiveDescriptionError, setNewPrimitiveDescriptionError ] = useState("");
    const [ newPrimitiveMessageError, setNewPrimitiveMessageError ] = useState("");
    const [ newPrimitiveClassNameError, setNewPrimitiveClassNameError ] = useState("");
    const [ newPrimitiveListenerFileError, setNewPrimitiveListenerFileError ] = useState("");

    const { setSelectedTab } = useContext(SelectedTab);

    const [ isSuccess, setIsSuccess ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setNewPrimitiveListenerFile(selectedFile);
    };
    
    const handleRemoveFile = () => {
        setNewPrimitiveListenerFile(null);
    }; 

    const validateForm = () => {
      let isValid = true;
      let newPrimitiveNameError = '';
      let newPrimitiveDescriptionError = '';
      let newPrimitiveMessageError = '';
      let newPrimitiveClassNameError = '';
      let newPrimitiveListenerFileError = '';
  
      const error = true;
      const id="outlined-error-helper-text";
      const label="Error";
      let helperText='';
  
      // Validación del nombre de la tecnica de proteccion
      if (!newPrimitiveName) {
        isValid = false;
        helperText = 'The name of the protection technique is required.';
        
        newPrimitiveNameError = { error, id, label, helperText }
  
      } else if (newPrimitiveName.length < 6) {
        isValid = false;
        helperText = 'The name of the protection technique should be more descriptive and detailed.';
        
        newPrimitiveNameError = { error, id, label, helperText }
      }
  
      // Validación de la descripcion de la tecnica de proteccion
      if (!newPrimitiveDescription) {
        isValid = false;
        helperText = 'The description of the protection technique is required.';
        
        newPrimitiveDescriptionError = { error, id, label, helperText }
  
      } else if (newPrimitiveDescription.length < 40) {
        isValid = false;
        helperText = 'The description must contain at least 40 characters.';
        
        newPrimitiveDescriptionError = { error, id, label, helperText }
      }

      // Validación del mensaje de solicitud al administrador de la tecnica de proteccion
      if (!newPrimitiveMessage) {
        isValid = false;
        helperText = 'The upload request message is required.';
        
        newPrimitiveMessageError = { error, id, label, helperText }
      } 

      // Validación del nombre de la clase del archivo Listener
      if (!newPrimitiveClassName) {
        isValid = false;
        helperText = 'The class name is required.';
        
        newPrimitiveClassNameError = { error, id, label, helperText }
      } 

      // Validación del archivo
      if (!newPrimitiveListenerFile) {
        isValid = false;
        helperText = 'Missing file <Listener>.py';
        
        newPrimitiveListenerFileError = helperText
      } else if (newPrimitiveListenerFile.name.split(".")[newPrimitiveListenerFile.name.split(".").length-1] !== "py") {
        console.log(newPrimitiveListenerFile.name.split(".")[newPrimitiveListenerFile.name.split(".").length-1]);
        isValid = false;
        helperText = 'The file must be in ".py" format.';
        
        newPrimitiveListenerFileError = helperText
      } 
  
      setNewPrimitiveNameError(newPrimitiveNameError);
      setNewPrimitiveDescriptionError(newPrimitiveDescriptionError);
      setNewPrimitiveMessageError(newPrimitiveMessageError);
      setNewPrimitiveClassNameError(newPrimitiveClassNameError);
      setNewPrimitiveListenerFileError(newPrimitiveListenerFileError);
  
      return isValid;
    };  

    const handleSubmit = async () => {
      let request = "";

      setIsLoading(true);

      if (validateForm()) {
        try {

          const loggedUserJSON = window.localStorage.getItem('loggedUser');
          const token = JSON.parse(loggedUserJSON);

          request = await LoginService.uploadPrimitiveTechnique(
              newPrimitiveName, 
              newPrimitiveDescription, 
              newPrimitiveMessage, 
              newPrimitiveClassName, 
              newPrimitiveListenerFile, 
              token 
          );
          
          setIsSuccess(true);
  
        } catch (error) {
          // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario

          console.error('Error al enviar solicitud:', error.message);
        }
  
      } else {
        setIsLoading(false);
        console.log('Formulario inválido');
      }
  
      console.log('Info', request);
    };

    const cleanForm = () => {
      setNewPrimitiveName("");
      setNewPrimitiveDescription("");
      setNewPrimitiveMessage("");
      setNewPrimitiveClassName("");
      setNewPrimitiveListenerFile(null);

      setIsSuccess(false);
      setIsLoading(false);
    }



    
    function downloadBaseListener() {
      const axios = require('axios').default;
    
      var session_url = "http://localhost:8000/DownloadBaseListener/";
      var username = '.wmtAPI.3691.';
      var password = 'wmt.tesis.3025915';
  
      //const FileDownload = require('js-file-download');
  
      axios.post(session_url, {}, {
          auth: {
              username,
              password
          },
          contentType: 'application/zip',
          responseType: 'blob',
      })
      .then(res => {
        // Extraer nombre del header
        const contentDisp = res.headers['content-disposition'];
        let filename = 'JavaBaseListener.zip';
        if (contentDisp) {
          const match = contentDisp.match(/filename\*=UTF-8''(.+)$|filename="(.+)"/);
          filename = match ? (decodeURIComponent(match[1] || match[2])) : filename;
        }
    
        // Crear Blob URL
        const blob = new Blob([res.data], { type: 'application/zip' });
        const url  = window.URL.createObjectURL(blob);
    
        // Crear un enlace temporal para forzar la descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    
        // Limpiar
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Error en download', err);
      });
    }



    useEffect(() => {
        setSelectedTab(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        isSuccess ? ( 
          <UploadTechniqueModal setIsSuccess={setIsSuccess} cleanForm={cleanForm}/>
        ) : (
          <Container component="main">
            <Paper className="paper" elevation={3}>
              <Typography component="h1" variant="h5">
                Protection Technique Upload Request
              </Typography>
              <form className="form" noValidate>
                <Box className="text-field-box">
                  <TextField
                    className="field"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="primitiveName"
                    label="Name of the protection technique."
                    name="primitiveName"
                    autoComplete="primitive-name"
                    autoFocus
                    value={newPrimitiveName}
                    onChange={(e) => setNewPrimitiveName(e.target.value)}
                    { ...newPrimitiveNameError }
                  />
                  <Tooltip title="This is the name under which the protection technique will later appear in the list of techniques." arrow>
                    <InfoOutlinedIcon className="info-icon" />
                  </Tooltip>
                </Box>
                <Box className="text-field-box">
                  <TextField
                    className="field"
                    variant="outlined"
                    margin="normal"
                    required
                    multiline
                    fullWidth
                    id="primitiveDescription"
                    label="Full description and use of the protection technique"
                    placeholder="Write a complete description of how the protection technique is used and what effect it has"
                    name="primitiveDescription"
                    autoComplete="primitive-description"
                    value={newPrimitiveDescription}
                    onChange={(e) => setNewPrimitiveDescription(e.target.value)}
                    { ...newPrimitiveDescriptionError }
                  />
                  <Tooltip title="This description must clearly detail the purpose and the way the protection technique is used, as it will later appear alongside the protection technique in the list of techniques. This description is the only text that will be associated with the protection technique in the UI." arrow>
                    <InfoOutlinedIcon className="info-icon" />
                  </Tooltip>
                </Box>
                <Box className="text-field-box">
                  <TextField
                    className="field"
                    variant="outlined"
                    margin="normal"
                    required
                    multiline
                    fullWidth
                    id="primitiveMessage"
                    label="Request message for uploading the protection technique to the server intended for the administrator"
                    placeholder="Message explaining the internal functioning of the protection technique implementation"
                    name="primitiveMessage"
                    autoComplete="primitive-message"
                    value={newPrimitiveMessage}
                    onChange={(e) => setNewPrimitiveMessage(e.target.value)}
                    { ...newPrimitiveMessageError }
                  />
                  <Tooltip title="This message is intended for the website administrator and explains technical details of the implementation of the protection technique, if necessary, as well as its purpose. This request message will only be seen by the website administrator." arrow>
                    <InfoOutlinedIcon className="info-icon" />
                  </Tooltip>
                </Box>
                <Box className="text-field-box">
                  <TextField
                    className="field"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="primitiveClassName"
                    label="Name of the class inside the Listener file"
                    placeholder="Write the exact name of the class as it is declared in the Python script"
                    name="primitiveClassName"
                    autoComplete="primitive-class-name"
                    value={newPrimitiveClassName}
                    onChange={(e) => setNewPrimitiveClassName(e.target.value)}
                    { ...newPrimitiveClassNameError }
                  />
                  <Tooltip title='Here you must write the name of the class exactly as it is defined inside the .py file. For example, if the class is: "class JavaDuplicateListener(JavaParserListener):" you should write "JavaDuplicateListener"' arrow>
                    <InfoOutlinedIcon className="info-icon" />
                  </Tooltip>
                </Box>
                <div className="file-upload-container">
                    <label htmlFor="file-input" className="file-upload-label">
                        <input
                        type="file"
                        id="file-input"
                        key={newPrimitiveListenerFile ? newPrimitiveListenerFile.name : 'default'}
                        onChange={handleFileChange}
                        className="file-input"
                        />
                        <span className="file-upload-button">Choose File</span>
                    </label>
                    {newPrimitiveListenerFile && (
                        <div className="file-info-container">
                          <p className="file-info">Selected File: {newPrimitiveListenerFile.name}</p>
                          <button className="remove-button" onClick={handleRemoveFile}>
                              <DeleteIcon />
                          </button>
                        </div>
                    )}
                    {newPrimitiveListenerFileError && (
                        <p className="file-info-error"> {newPrimitiveListenerFileError} </p>
                    )}
                    <button
                      onClick={downloadBaseListener} 
                      className="file-upload-label"
                      style={{
                        padding: "14px",
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease-in-out",
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        fontSize: "15px",
                      }}
                    >
                      Download Listener Template
                    </button>
                </div>
                {isLoading ? (
                  <LoadingCircularIndicator />
                ) : (
                  <Button
                    type="button" // Cambia a "submit" si estás enviando el formulario a un servidor
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="submit"
                    onClick={handleSubmit}
                  >
                    SUBMIT
                  </Button>
                )}
              </form>
            </Paper>
          </Container>
        )
  );
}
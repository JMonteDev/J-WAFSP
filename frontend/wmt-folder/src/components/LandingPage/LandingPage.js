import React, { useState, useEffect, useContext} from "react";
import { SelectedPrimitive } from "../../contexts/SelectedPrimitive";
import { SelectedFiles } from "../../contexts/SelectedFiles";
import { SelectedTab } from "../../contexts/SelectedTab";
import { LoginContext } from "../../contexts/LoginContext";
import { v4 as uuidv4 } from 'uuid';
import "./LandingPageStyle.scss";
import { Container, Typography, Box, Stepper, Step, StepLabel, Button } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import ActiveStep from "../../Utils/ActiveStep";
import FinalStep from "./Steps/FinalStep/FinalStep";
import { useNavigate } from "react-router-dom";
import LoginService from "../../services/LoginService";


export default function LandingPage() {
    const navigate = useNavigate();

    const { setSelectedTab } = useContext(SelectedTab);

    const { loggedUser, setLoggedUser } = useContext(LoginContext);
    const { setFirstName } = useContext(LoginContext);

    const steps = ['Select protection technique', 'Upload Project', 'Results']; // ETIQUETAS DE LOS PASOS
    const { selectedPrimitive, setSelectedPrimitive, controlPrimitive, setControlPrimitive } = useContext(SelectedPrimitive);
    const { selectedFiles } = useContext(SelectedFiles);
    const { setDownloadUrl } = useContext(SelectedFiles);
    const { setFilename } = useContext(SelectedFiles);
    const { setErrorsByFile } = useContext(SelectedFiles);
    const { setLoadingResponse } = useContext(SelectedFiles);
    const { cleanAll } = useContext(SelectedFiles);


    function upload() {
        const axios = require('axios').default;
    
        var formData = new FormData();
        var cant = 0;
        for (var a=0; a < selectedFiles.length; a++){
            if (selectedFiles[a].name) {
                formData.append(`file${cant+1}`, selectedFiles[a]); 
                formData.append(`path${cant+1}`, selectedFiles[a].webkitRelativePath);
                cant++;
            }
        }
        formData.append("cant", cant);
        formData.append("key", uuidv4());
        formData.append("primitiveId", selectedPrimitive.id);
        
        console.log(selectedFiles);
        console.log(formData, cant); 
        console.log(selectedPrimitive.id);
        
    
        var session_url = "http://localhost:8000/WMTFilesClass/";
        var username = '.wmtAPI.3691.';
        var password = 'wmt.tesis.3025915';
    
        axios.post(session_url, formData, {
            auth: {
                username,
                password
            },
            contentType: 'application/zip',
            responseType: 'blob',
            onUploadProgress : progressEvent => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`upload process: ${percentCompleted}%`);
            },
            onDownloadProgress: progressEvent => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`download process: ${percentCompleted}%`);
            }
        })
        .then(res => {
          const contentDisp = res.headers['content-disposition'];
          if (contentDisp) {
            const match = contentDisp.match(/filename\*=UTF-8''(.+)$|filename="(.+)"/);
            const name = match ? (match[1] || match[2]) : null;
            if (name) setFilename(decodeURIComponent(name));
            
          }
    
          const errsHeader = res.headers['x-wmt-errors'];
          const errors     = errsHeader ? JSON.parse(errsHeader) : [];
          console.log('Errores de ANTLR:', errors);
          setErrorsByFile(errors);
    
          const blob = new Blob([res.data], { type: 'application/zip' });
          const url  = window.URL.createObjectURL(blob);
          setDownloadUrl(url);
        })
        .catch(err => {
          console.error('Error en upload/download', err);
        })
        .finally(() => {
            setLoadingResponse(false);
        });
    }



    const [activeStep, setActiveStep] = useState(() => {
        const localData = window.sessionStorage.getItem('activeStep');
        return localData ? JSON.parse(localData) : 0;                                         // GUARDA EL PASO ACTIVO EN EL MOMENTO
    });

    const handleNext = () => {                                                    // LOGICA DE BOTON DE NEXT
        if (activeStep === 0 && selectedPrimitive === "") { setControlPrimitive(1); }
        else { setActiveStep((prevActiveStep) => prevActiveStep + 1); }
        if (activeStep === steps.length - 2) { 
            console.log("upload");      
            upload()      
        }
    };

    const handleBack = () => {                                                    // LOGICA DE BOTON DE BACK
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {                                                    // LOGICA DE BOTON DE RESET
        setActiveStep(0);
        setSelectedPrimitive("");
        cleanAll();
        window.sessionStorage.clear()
    };

    useEffect(() => {
        setSelectedTab(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.sessionStorage.setItem('activeStep', JSON.stringify(activeStep));
        console.log("activeStep", activeStep);
        
      }, [activeStep]);

    useEffect(() => { 
        async function fetchFirstName() {
            if (window.localStorage.getItem('loggedUser')) {
                const tokenExpired = await LoginService.handleFirstName(setFirstName, setLoggedUser);
                console.log('token landing', tokenExpired);
                if (tokenExpired) {
                    navigate('/login');
                }
            }
        }

        fetchFirstName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box className="boxContainer" sx={{boxShadow: 4}}>
            {loggedUser ? (
                <React.Fragment>
                    <Stepper activeStep={activeStep} className="stepper">
                        {steps.map((label, index) => {
                            const stepProps = {};                                           // ESTO ES PARA QUE FUNCIONE EL STEPPER
                            const labelProps = {};

                            return (
                                <Step key={label} {...stepProps} >
                                    <StepLabel {...labelProps}>{label}</StepLabel>          {/* RENDER DE LOS TITULOS DE LOS PASOS */}
                                </Step>
                            );
                        })}
                    </Stepper>


                    {activeStep === steps.length-1 ? (

                        <React.Fragment>

                            <FinalStep /> {/* ACA TENGO QUE PONER EL PASO FINAL */}

                            <Box className="buttonBox">
                                <Button onClick={handleReset} className="resetButton"> Reset </Button>              {/* BOTON DE RESET */}
                            </Box>

                        </React.Fragment>

                    ) : (

                        <React.Fragment>

                            <Box className="activeStepBox">
                                <ActiveStep activeStep={activeStep} />                                       {/* ACA SE RENDERIZA LO QUE VA EN CADA PASO, SE PODRIA HACER LO MISMO QUE EN SELECTED TAB */}
                            </Box>

                            <Box className="buttonBox">
                                <Button                                                     // BOTON DE BACK
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className="backButton"
                                >
                                    Back
                                </Button>

                                <Button onClick={handleNext} disabled={controlPrimitive === 1 || (selectedFiles.length === 0 && activeStep === steps.length - 2)} className="nextButton">                                {/* BOTON DE NEXT Y FINISH */}
                                    { activeStep === steps.length - 2 ? 'Upload' : 'Next' }
                                </Button> {/* CONTROLAR QUE HAYA SELECCIONADO UN LENGUAJE Y UNA PRIMITIVA */}
                            </Box>
                        </React.Fragment>

                    )}
                </React.Fragment>
            ) : (
                <Container
                    maxWidth="md"
                    sx={{
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}>
                    <ShieldIcon sx={{ fontSize: 90, color: "primary.main", mb: 3 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Protegé tu código Java en segundos
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
                        Bienvenido a J-WAFSP, una herramienta de protección de código fuente Java. Para
                        empezar, iniciá sesión o registrate y asegurá tu proyecto.
                    </Typography>
                    
                </Container>
            )}
        </Box>
    );
}
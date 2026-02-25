import React, { useEffect, useContext } from "react";
import { SelectedFiles } from "../../../../contexts/SelectedFiles";
import AntlrErrorReport from "../UploadStep/test/AntlrErrorReport";
import LoadingCircularIndicator from "../../../../Utils/LoadingCircularIndicator";

export default function FinalStep() {
    const { downloadUrl } = useContext(SelectedFiles);
    const { filename } = useContext(SelectedFiles);
    const { errorsByFile } = useContext(SelectedFiles);
    const { loadingResponse } = useContext(SelectedFiles);

    useEffect(() => {
        console.log("selectedFiles", filename);
    }, [filename]);

    return ( 
        <div>
            { loadingResponse ? (
                <div style={{ margin: "3rem"}}>
                    <LoadingCircularIndicator />
                </div>
            ) : (
                <div style={{
                    display: "flex",
                    flexDirection: "column",      // apila contenidos en columna
                    justifyContent: "center",     // centra horizontalmente
                    alignItems: "center",         // centra verticalmente (dentro de su propio alto)
                    margin: "3rem 0",             // solo separación arriba/abajo
                }}>
                    {downloadUrl && ( 
                        <a href={downloadUrl} download={filename} style={{ textDecoration: 'none' }}>
                            <button style={{
                                display: "flex",
                                padding: "10px 20px",
                                backgroundColor: "#2980b9",
                                color: "white",
                                borderRadius: "8px",
                                border: 'none',        // quita el borde sólido
                                outline: 'none',
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                marginBottom: "1.5rem",
                            }}>DOWNLOAD PROJECT</button>
                        </a>
                    )}
                    {downloadUrl && ( 
                        <div>
                            <AntlrErrorReport errorsByFile={errorsByFile} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
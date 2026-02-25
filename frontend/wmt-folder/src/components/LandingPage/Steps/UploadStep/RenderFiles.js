import React, {useContext, useEffect} from "react";
import { UploadedFiles } from "../../../../contexts/UploadedFiles";
import { SelectedPrimitive } from "../../../../contexts/SelectedPrimitive";
import InsertDriveFileSharpIcon from '@mui/icons-material/InsertDriveFileSharp';
import FolderSharpIcon from '@mui/icons-material/FolderSharp';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { v4 as uuidv4 } from 'uuid';

export default function RenderFiles() {
    const { uploadedFiles, willRenderFiles, changeVisibility, deleteItem } = useContext(UploadedFiles);
    const { selectedPrimitive } = useContext(SelectedPrimitive);

    function compare(a, b) {
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

    function renderFiles2(path)
    {
        path = path || "";
        var padding = path.split("/").length * 15;
        
        return willRenderFiles.length > 0 && willRenderFiles[0] !== 'undefined' && willRenderFiles.filter(item => item.path === path).map(item => {
            return (
                !item.file ? ( <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div key={uuidv4()} style={{paddingLeft:`${padding}px`, paddingTop: "10px"}} onClick={() => changeVisibility(item.key)}><FolderSharpIcon sx={{paddingRight: "10px"}} /> {item.fileName} </div><DeleteOutlineOutlinedIcon sx={{paddingLeft: "20px"}}  onClick={() => {deleteItem(item.key)}} />
                    </div>
                    {renderFiles2(path + item.fileName + "/")}
                </div>) : (<div style={{display: "flex", flexDirection: "row"}}>
                    <div key={uuidv4()} style={{paddingLeft:`${padding}px`, paddingTop: "5px"}}><InsertDriveFileSharpIcon sx={{paddingRight: "10px"}} /> {item.fileName} </div> <DeleteOutlineOutlinedIcon sx={{paddingLeft: "20px"}} onClick={() => {deleteItem(item.key)}}/>
                </div>)
            );
        });
    }

    function upload() {
        const axios = require('axios').default;

        var formData = new FormData();
        var cant = 0;
        for (var a=0; a < uploadedFiles.length; a++){
            if (uploadedFiles[a].file) {
                formData.append(`file${cant+1}`, uploadedFiles[a].file); 
                formData.append(`path${cant+1}`, uploadedFiles[a].path + uploadedFiles[a].fileName);
                cant++;
            }
        }
        formData.append("cant", cant);
        formData.append("key", uuidv4());
        formData.append("primitiveId", selectedPrimitive.id);
        
        console.log(uploadedFiles);
        console.log(formData, cant); 
        console.log(selectedPrimitive.id);
        

        var session_url = "http://localhost:8000/WMTFilesClass/";
        var username = '.wmtAPI.3691.';
        var password = 'wmt.tesis.3025915';

        const FileDownload = require('js-file-download');

        axios.post(session_url, formData, {
            auth: {
                username,
                password
            },
            contentType: 'application/zip',
            responseType: 'arraybuffer',
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
            console.log(res.data)
            console.log(res.data.url)
            FileDownload(res.data, 'Project.zip');
        })
    }

    useEffect(() => {                                               // SE DISPARA CADA VEZ QUE SE AGREGA UN ARCHIVO O CARPETA
        willRenderFiles.sort(compare);
        
    }, [willRenderFiles]);

    return (<div>{ 
            renderFiles2()
        }
            {<div>
                <button onClick={() => upload()}>
                    Subir
                </button>        
            </div>}
        </div>);
}

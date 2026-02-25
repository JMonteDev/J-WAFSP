import { useEffect, useContext } from 'react';
import { SelectedFiles } from '../../../../../contexts/SelectedFiles';
import GenerateTree from './GenerateTree';
import RenderTreeView from './RenderTreeView';
import FolderIcon from '@mui/icons-material/Folder';

const FileSelector = () => {
  const { selectedFiles, setSelectedFiles } = useContext(SelectedFiles);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const fileList = Array.from(files);

    setSelectedFiles(fileList);
  };


  useEffect(() => {
      console.log("selectedFiles", selectedFiles);
  }, [selectedFiles]);

  return (
    <div>
      <div
        style={{
          margin: "2rem",
          height: "10vh",
          display: "flex",
          justifyContent: "center", // Centrado horizontal
          alignItems: "center",     // Centrado vertical
        }}
      >
        <div>
          <label
            htmlFor="folder-upload"
            style={{
              display: "flex",
              padding: "10px 20px",
              backgroundColor: "#2980b9",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            }}
          >
            <FolderIcon style={{paddingRight: "7px"}}></FolderIcon> <div style={{paddingTop: "2.5px"}}>Select project</div>
          </label>

          <input
            id="folder-upload"
            type="file"
            webkitdirectory="true"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {selectedFiles.length !== 0 && ( 
        <div style={{ marginBottom: "1.5rem"}}>
          <h2 style={{ paddingLeft: "20rem", fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif" }}>Selected files:</h2>
          
          {<RenderTreeView tree={GenerateTree.generarArbolJSON(selectedFiles.map( file => file.webkitRelativePath ))} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} /> }

        </div>
      )}
    </div>
  );
};

export default FileSelector;

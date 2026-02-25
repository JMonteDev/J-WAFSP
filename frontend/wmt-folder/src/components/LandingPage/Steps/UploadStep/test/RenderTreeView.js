import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';




const RenderTreeView = ({ tree, selectedFiles, setSelectedFiles }) => {

  const useStyles = {
    root: {
      padding: "3%",
      maxWidth: "600px",
      margin: 'auto',
    },
    treeItem: {
      '&.MuiTreeItem-root.Mui-selected, &.MuiTreeItem-root.Mui-selected.Mui-focused': {
        backgroundColor: 'rgba(25, 118, 210, 0.3)',
      },
      minWidth: "90%",
    },
    typography: {
      fontSize: "16",
      whiteSpace: 'nowrap',
    },
    treeView: {
      maxWidth: "80%",
      margin: '1% 30% 1% 30%',
      overflow: 'hidden',
      '& .MuiTreeItem-content': {
        paddingLeft: "2%",
        position: 'relative',
      },
      '& .MuiTypography-body2': {
        fontSize: '1.2rem',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.5rem',
      },
    },
    fileContainer: {
      display: "flex",
    },
    removeButton: {
      position: 'absolute',
      top: '50%',
      right: '10px', 
      transform: 'translateY(-50%)',
    },
  };

  const handleRemoveFile = (item) => {
    console.log('Eliminar:', item);
    let newSelectedFiles;

    if (item.path.charAt(item.path.length - 1) === "/") {             // ES UNA CARPETA LA QUE SE QUIERE ELIMINAR

      newSelectedFiles = selectedFiles.filter((item2) => !item2.webkitRelativePath.startsWith(item.path.slice(1)));

    } else {                                                          // ES UN ARCHIVO LA QUE SE QUIERE ELIMINAR

      newSelectedFiles = selectedFiles.filter((item2) => item2.webkitRelativePath !== item.path.slice(1));

    }

    console.log(newSelectedFiles);

    setSelectedFiles(newSelectedFiles)
  }
  
  const renderTree = (nodes) => {
      return (
        <TreeItem 
            sx={useStyles.treeItem}
            key={nodes.path}
            nodeId={nodes.path} 
            label={
                <div>
                  <Typography variant="body2" sx={useStyles.typography}>
                    {nodes.label}
                  </Typography>
                  <IconButton sx={useStyles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que se propague el evento al TreeItem
                      handleRemoveFile(nodes);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
            } 
            icon={
                  nodes.children.length ? null : <InsertDriveFileIcon />
            }
        >
            {Array.isArray(nodes.children) ? nodes.children.map(renderTree) : null}
        </TreeItem>
  )};

  return (
    <div sx={useStyles.root}>
      <TreeView
          sx={useStyles.treeView}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
      >
          {tree.children[0] ? renderTree(tree.children[0]) : null}
      </TreeView>
    </div>
  );
};

export default RenderTreeView;
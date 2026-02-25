import React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const useStyles = {
  dialog: {
    maxWidth: '400px',
    margin: '10vh auto',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
  },
  title: {
    backgroundColor: '#2196f3',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: '20px !important',
  },
  actions: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid #ddd',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
  },
};

function UploadTechniqueModal({ setIsSuccess, cleanForm }) {
  const handleModalClose = () => {
    // Redirige a la pagina en que estaba al cerrar el modal
    setIsSuccess(false);
    cleanForm();
  };

  return (
      <Dialog open onClose={handleModalClose} sx={useStyles.dialog}>
        <DialogTitle sx={useStyles.title}>
          <Typography variant="h6">Request submitted successfully!</Typography>
        </DialogTitle>
        <DialogContent sx={useStyles.content}>
          <Typography variant="body1">The upload request for your protection technique has been submitted successfully.</Typography>
          <Typography variant="body1">You will be notified at the email associated with this account when it becomes available on the site.</Typography>
        </DialogContent>
        <DialogActions sx={useStyles.actions}>
          <Button onClick={handleModalClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default UploadTechniqueModal;

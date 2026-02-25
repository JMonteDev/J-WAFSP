import React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate  } from 'react-router-dom';

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

function SignUpModal() {
  const navigate = useNavigate();

  const handleModalClose = () => {
    // Redirige a HOME al cerrar el modal
    navigate('/');
  };

  return (
      <Dialog open onClose={handleModalClose} sx={useStyles.dialog}>
        <DialogTitle sx={useStyles.title}>
          <Typography variant="h6">Registrado con éxito</Typography>
        </DialogTitle>
        <DialogContent sx={useStyles.content}>
          <Typography variant="body1">¡Gracias por registrarte! Tu cuenta ha sido creada exitosamente.</Typography>
        </DialogContent>
        <DialogActions sx={useStyles.actions}>
          <Button onClick={handleModalClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default SignUpModal;

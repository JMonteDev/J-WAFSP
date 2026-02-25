import {useContext} from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LoginContext } from '../../contexts/LoginContext';

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
  titleFont: {
    fontSize: "1.25rem",
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

function LoginModal({ setTokenExpired }) {
  const { setLoggedUser } = useContext(LoginContext);

  const handleModalClose = () => {
    setLoggedUser('');
    setTokenExpired(false);
  };

  return (
      <Dialog open onClose={handleModalClose} sx={useStyles.dialog}>
        <DialogTitle sx={useStyles.title}>
          <Typography sx={useStyles.titleFont}>Su sesión ha expirado</Typography>
        </DialogTitle>
        <DialogContent sx={useStyles.content}>
          <Typography variant="body1">Inicie sesión nuevamente.</Typography>
        </DialogContent>
        <DialogActions sx={useStyles.actions}>
          <Button onClick={handleModalClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default LoginModal;

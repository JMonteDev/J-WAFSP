import { LinearProgress, Container } from '@mui/material';

const useStyles = {
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10vh', // Ajusta la altura según tus necesidades
        width: '30vw',
        marginBottom: '5vh',
    },
    loadingBar: {
        width: '40vw',
    }
};

const LoadingLinearIndicator = () => {
  return (
    <Container sx={useStyles.loadingContainer}>
      <LinearProgress sx={useStyles.loadingBar} />
    </Container>
  );
};

export default LoadingLinearIndicator;

import { CircularProgress, Container } from '@mui/material';

const useStyles = {
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10vh', // Ajusta la altura según tus necesidades
        width: '30vw',
    },
    loadingBar: {
        width: '40vw',
    }
};

const LoadingCircularIndicator = () => {
  return (
    <Container sx={useStyles.loadingContainer}>
      <CircularProgress sx={useStyles.loadingBar} />
    </Container>
  );
};

export default LoadingCircularIndicator;

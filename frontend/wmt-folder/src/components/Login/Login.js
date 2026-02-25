import { useContext, useEffect, useState } from "react";
import { SelectedTab } from "../../contexts/SelectedTab";
import { LoginContext } from "../../contexts/LoginContext";
import LoginService from "../../services/LoginService";
import { useNavigate  } from 'react-router-dom';
import { Button, TextField, Container, Paper, Typography } from '@mui/material';
import "./LoginStyle.scss";
import LoginModal from "./LoginModal";

const useStyles = {
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
  },
  form: {
    width: '100%',
    marginTop: 1,
  },
  submit: {
    marginTop: 2,
  },
};


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  
  const [tokenExpired, setTokenExpired] = useState('');

  const { loggedUser, setLoggedUser } = useContext(LoginContext);
  
  const navigate = useNavigate();

  const { setSelectedTab } = useContext(SelectedTab);

  useEffect(() => {
    if (loggedUser === -1) {
      setTokenExpired(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenExpired]);
    
  useEffect(() => {
    setSelectedTab(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newEmailError = '';
    let newPasswordError = '';

    const error = true;
    const id="outlined-error-helper-text";
    const label="Error";
    let helperText='';

    // Validación del mail
    if (!email) {
      isValid = false;
      helperText = 'Email address is required';
      
      newEmailError = { error, id, label, helperText }

    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      helperText = 'Invalid email address';
      
      newEmailError = { error, id, label, helperText }
    }

    // Validación de la contraseña
    if (!password) {
      isValid = false;
      helperText = 'Password is required';
      
      newPasswordError = { error, id, label, helperText }

    } else if (password.length < 6) {
      isValid = false;
      helperText = 'Password must be at least 6 characters long';
      
      newPasswordError = { error, id, label, helperText }
    }

    setEmailError(newEmailError);
    setPasswordError(newPasswordError);

    return isValid;
  };  

  const handleLogin = async () => {

    if (validateForm()) {
      try {
        const user = await LoginService.login({
          email,
          password
        })

        console.log('Respuesta del servidor:', user.access);
        window.localStorage.setItem(
          'loggedUser', JSON.stringify(user.access)
        )        
        setLoggedUser(user.access);

        if (user) {
          navigate('/');
        }

      } catch (error) {
        // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario

        const id="outlined-error-helper-text";
        const label="Wrong credentials";
        let helperText='User or password incorrect';

        let newEmailError = { error, id, label }
        let newPasswordError = { error, id, label, helperText }

        setEmailError(newEmailError);
        setPasswordError(newPasswordError);

        console.error('Error al iniciar sesión:', error.message);
      }

    } else {
      console.log('Formulario inválido');
    }

    console.log('Iniciar Sesión', email, password);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    tokenExpired ? (
      <LoginModal setTokenExpired={setTokenExpired} />
    ) : (
      <Container component="main" maxWidth="xs">
        <Paper sx={useStyles.paper} elevation={3}>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <form sx={useStyles.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              { ...emailError }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              { ...passwordError }
            />
            <Button
              type="button" 
              fullWidth
              variant="contained"
              color="primary"
              sx={useStyles.submit}
              onClick={handleLogin}
              onKeyDown={handleKeyDown}
            >
              LOG IN
            </Button>
          </form>
        </Paper>
      </Container>
    )
  );
}

export default Login;

import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Container, Paper, Typography } from '@mui/material';
import { SelectedTab } from "../../contexts/SelectedTab"; 
import SignUpModal from './SignUpModal';
import "./SignUpStyle.scss";

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

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    personalDescription: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    personalDescription: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const { setSelectedTab } = useContext(SelectedTab);
    
  useEffect(() => {
    setSelectedTab(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
      personalDescription: null,
    };

    const error = true;
    const id="outlined-error-helper-text";
    const label="Error";
    let helperText='';

    // Validación del nombre
    if (!formData.firstName) {
      isValid = false;
      helperText = 'El nombre es obligatorio';
      
      newErrors.firstName = { error, id, label, helperText }
    }
    
    // Validación del apellido
    if (!formData.lastName) {
      isValid = false;
      helperText = 'El apellido es obligatorio';
      
      newErrors.lastName = { error, id, label, helperText }
    }

    // Validación del mail
    if (!formData.email) {
      isValid = false;
      helperText = 'El correo electrónico es obligatorio';
      
      newErrors.email = { error, id, label, helperText }

    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      helperText = 'Correo electrónico inválido';
      
      newErrors.email = { error, id, label, helperText }
    }

    // Validación de la contraseña
    if (!formData.password) {
      isValid = false;
      helperText = 'La contraseña es obligatoria';
      
      newErrors.password = { error, id, label, helperText }

    } else if (formData.password.length < 6) {
      isValid = false;
      helperText = 'La contraseña debe tener al menos 6 caracteres';
      
      newErrors.password = { error, id, label, helperText }
    }

    // Validación de la confirmacion de la contraseña
    if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
      isValid = false;
      helperText = 'Es necesario que ambas contraseñas coincidan';
      
      newErrors.confirmPassword = { error, id, label, helperText }
    }

    setErrors(newErrors);
    return isValid;
  };  

  const handleSignUp = () => {
    if (validateForm()) {
      // Aquí puedes enviar los datos del formulario a tu servidor o hacer lo que necesites
      console.log('Formulario válido, enviar datos:', formData);

      setIsSuccess(true);
    } else {
      console.log('Formulario inválido');
    }
  };

  return (
    isSuccess ? ( 
        <SignUpModal />
      ) : (
        <Container component="main" maxWidth="xs">
        <Paper sx={useStyles.paper} elevation={3}>
          <Typography component="h1" variant="h5">
            Registrarse
          </Typography>
          <form sx={useStyles.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Nombre"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={formData.firstName}
              onChange={handleChange}
              { ...errors.firstName }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Apellido"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              { ...errors.lastName }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              { ...errors.email }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              { ...errors.password }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              { ...errors.confirmPassword }
            />
            <TextField
              variant="outlined"
              margin="normal"
              multiline
              fullWidth
              id="description"
              label="Descripción personal (Opcional)"
              placeholder="Escriba una breve descripción de su propósito de uso para la herramienta..."
              name="personalDescription"
              autoComplete="personal-description"
              value={formData.personalDescription}
              onChange={handleChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={useStyles.submit}
              onClick={handleSignUp}
            >
              Registrarse
            </Button>
          </form>
        </Paper>
      </Container>
    )
  );
}

export default SignUp;

import { useEffect, useCallback } from "react";
import "./InformationStyle.scss";


// import React, { useState } from 'react';

const Information2 = () => {
  // Asegurarnos de que no haya márgenes en el body
  useEffect(() => {
    document.body.style.margin = '0';
    return () => {
      document.body.style.margin = '';
    };
  }, []);

  // Handler para el botón de descarga (personalízalo según mi lógica)
  const handleDownload = useCallback(() => {
    // Ejemplo sencillo: descargar un ZIP ubicado en /project.zip
    const link = document.createElement('a');
    link.href = '/project.zip';
    link.download = 'my-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Estilos inline para ocupar 100% de ancho y alto de la ventana
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#8fe8f3',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '1rem',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    marginTop: '1.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
 };

 export default Information2;

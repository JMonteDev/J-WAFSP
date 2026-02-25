import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import LandingPage from "../components/LandingPage/LandingPage";
import Information from "../components/Information/Information";
//import Information2 from "../components/Information2/Information2";
import Login from '../components/Login/Login';
import SignUp from '../components/SignUp/SignUp';
import { SelectedTab } from '../contexts/SelectedTab';
import { LoginContext } from '../contexts/LoginContext';
//import LoginService from '../services/LoginService';

import "./NavBar.scss";
import Information3 from '../components/Information3/Information3';

const NavBar = () => {
  const [loginVisible, setLoginVisible] = useState();
  const [signUpVisible, setSignUpVisible] = useState();
  const [logoutVisible, setLogoutVisible] = useState();


  const [loginMarginStyle, setLoginMarginStyle] = useState();
  
  const { selectedTab, setSelectedTab } = useContext(SelectedTab);
  const { loggedUser, setLoggedUser } = useContext(LoginContext);
  const { firstName, setFirstName } = useContext(LoginContext);

  const handleLoginClick = () => {
    setLoginVisible(false);
    setSignUpVisible(true);

    setLoginMarginStyle(true);
  }

  const handleSignupClick = () => {
    setSignUpVisible(false);
    setLoginVisible(true);

    setLoginMarginStyle(false); 
  }

  const handleLogoutClick = () => {
    logout();

    setSignUpVisible(true);
    setLoginVisible(true);
    setLogoutVisible(false);

    setLoginMarginStyle(false);

  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser');
    setLoggedUser('');
    setFirstName('');
  }
  
  const handleChange = (event, newValue) => {
    // ACA TENGO QUE IMPLEMENTAR LOS BOTONES
    setSelectedTab(newValue);
  };

  const handleRender = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      setLoginVisible(false);
      setSignUpVisible(false);
      setLogoutVisible(true);
    } else {
      setLoginVisible(true);
      setSignUpVisible(true);
      setLogoutVisible(false);
    }

    setLoginMarginStyle(false);
  }

  useEffect(() => {
    if (window.location.href.split('/')[window.location.href.split('/').length-1] === "login"){
      handleLoginClick();
    } else if (window.location.href.split('/')[window.location.href.split('/').length-1] === "signUp"){
      handleSignupClick();
    } else {
      handleRender();
    }
  });

  useEffect(() => {
      handleRender();
      if (loggedUser === '') {
        handleLogoutClick();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  return (
    <Router>
      <div>
        <nav>
          <AppBar sx={{display: "flex", flexDirection: "row", alignItems: "flex-end"}} className="appBar" position="fixed">
            <Tabs sx={{minWidth: "67.5%", marginLeft: "16.1%"}} centered={true} value={selectedTab !== null ? selectedTab : false} onChange={handleChange} aria-label="nav tabs">
              <Tab label="Home" component={NavLink} to="/" />
              <Tab label="Upload technique" component={NavLink} to="/uploadTechnique" />
              <Tab label="About" component={NavLink} to="/about" />
            </Tabs>
            {loginVisible && <Button  
              sx={{width: "8%", height: "90%", margin: loginMarginStyle ? "0.3%" : "0.3% 1% 0.3% auto"}} 
              variant="contained" 
              component={NavLink} 
              to="/login"
              onClick={handleLoginClick}>
                Log in
            </Button>}
            {signUpVisible && <Button  
              sx={{width: "8%", height: "90%", margin: "0.3% 1% 0.3% auto"}} 
              variant="contained" 
              component={NavLink} 
              to="/signUp"
              onClick={handleSignupClick}>
                Sign up
            </Button>}
            {firstName && <Typography  
              sx={{color: "#597081", width: "8%", height: "90%", margin: "0.3% 0% 0.4% auto", fontSize: "1.3rem"}} >
                {`¡Hola, ${firstName}!`}
            </Typography>}
            {logoutVisible && <Button  
              sx={{width: "8%", height: "90%", margin: "0.3% 1% 0.3% auto"}} 
              variant="contained" 
              onClick={handleLogoutClick}>
                Log out
            </Button>}
          </AppBar>
        </nav>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/uploadTechnique" element={<Information />} />
            <Route path="/uploadTechnique/result" element={<Information3 />} />
            <Route path="/about" element={<Information3 />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default NavBar;

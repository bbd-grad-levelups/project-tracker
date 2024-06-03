import React, { useState } from 'react';
import LoginButton from '../components/buttons/login-button'
import '../index.css'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Switch } from '@mui/material';
import { darkTheme, lightTheme } from "../theme.jsx";



function LoginPage() {
  try {
    if (sessionStorage.getItem("token")) {
      location.href = window.location.protocol + "//" + window.location.host;
    }
  } catch (e) {
    console.log(e);
  }
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkTheme = () => {
    setDarkMode(!darkMode);
  };
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <section className='login-navbar'>
          <p>Dark Mode</p>
          <Switch checked={darkMode} onChange={toggleDarkTheme}></Switch>
        </section>
        <section id="login-id" className="login-class">
          <h1>Welcome to Project-Tracker!</h1>
          <LoginButton />
        </section>
      </ThemeProvider>
    </>
  )
}

export default LoginPage
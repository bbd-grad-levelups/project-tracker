import React, { useState } from 'react';
import LoginButton from '../components/buttons/login-button'
import '../index.css'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Switch } from '@mui/material';
import { darkTheme, lightTheme } from "../theme.jsx";
import ThemedBox from '../components/login-card/login-card.jsx';


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
  const themeWord = theme.palette.mode == 'dark' ? 'Dark' : 'Light'
  console.log(theme.palette.mode);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <section className='login-page'>
          <section className='login-navbar'>
            <p>{themeWord} mode</p>
            <Switch checked={darkMode} onChange={toggleDarkTheme}></Switch>
          </section>
          <ThemedBox></ThemedBox>
        </section>
      </ThemeProvider>
    </>
  )
}

export default LoginPage
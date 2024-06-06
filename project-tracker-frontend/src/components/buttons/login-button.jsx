// src/Button.js
import Button from "@mui/material/Button";
import './login-button.css'; // Optional: For styling the button

const loginURL = `https://test-project.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=1echqqb1svir38d3quu5qsu63r&response_type=token&scope=email+openid+profile&attributes=name+email+username+nickname&redirect_uri=${window.location.protocol}//${window.location.host}/login`;

function handleClick() {
  window.location.href = loginURL;
  console.log(loginURL);
}

const LoginButton = () => {
  return (
    <Button color="primary" onClick={handleClick} id="login-button" size='Extra large'
      sx={{
        ':hover': {
          bgcolor: 'primary.main', // theme.palette.primary.main
          color: 'white',
        },
      }}
      style={{ height: '3rem', width: '15rem', border: '2px solid', fontSize: '1.2rem' }}
    >Login With Cognito</Button>
  );
};

export default LoginButton;

if (location.hash.includes("access_token")) {
  let hash = location.hash.substring(1);
  window.history.replaceState(null, null, ' ');
  let fragmentParams = new URLSearchParams(hash);
  const accessToken = fragmentParams.get("access_token");
  const idToken = fragmentParams.get("id_token");
  sessionStorage.setItem("idToken", idToken);
  sessionStorage.setItem("token", accessToken);
  loginUser()
}

function loginUser() {
  // let resp
  window.location.href = window.location.protocol + "//" + window.location.host;
  console.log(window.location.protocol + "//" + window.location.host);

}
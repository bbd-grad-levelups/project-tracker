import '../App.css';
import Button from "@mui/material/Button";

function ErrorPage() {

  return (
    <>
      <h1>Oops we seem to have had an error</h1>
      <div className="card">
        <p>
          Either you're in the wrong place or we messed up
        </p>
      </div>
      <p className="read-the-docs">
        Click button to return to home
      </p>
        <Button
          color="primary" onClick={redirectOnClick} id="login-button" size='Extra large'
          sx={{
            ':hover': {
              bgcolor: 'primary.main', // theme.palette.primary.main
              color: 'white',
            },
          }}
          titleStyle={{
            color: "white",
            fontSize: 16,
          }} style={{ height: '3rem', width: '12rem', border: '2px solid', fontSize: '1.2rem' }}
        >
          Click Me
        </Button>
      </>
      )
}

export default ErrorPage;

function redirectOnClick(){
  window.location.href = window.location.protocol + "//" + window.location.host;
}
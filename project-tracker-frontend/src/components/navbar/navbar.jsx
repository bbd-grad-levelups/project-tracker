import './navbar.css'
import { Switch, Button, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from "../../assets/logo.svg";
function NavBar({ darkMode, toggleDarkTheme, func }) {

    const theme = useTheme();
    var isAdmin = true;

    return (
            <Stack direction={'row'} spacing={3} alignItems={'center'} justifyContent={'center'} className="navbar">
                <img src={logo} className="logo" alt="Logo" onClick={() => func(-1)}/>
                {isAdmin ? (
                    <>
                        <Button variant="contained" color="secondary" type="submit" size="medium">Edit Project</Button>
                        <Button variant="contained" color="secondary" type="submit" size="medium">Edit Members</Button>
                        <Button variant="contained" color="secondary" type="submit" size="medium">Edit Links</Button>
                    </>
                ) : null
                }
                <Typography variant="body1">{theme.palette.mode} mode</Typography>
                <Switch checked={darkMode} onChange={toggleDarkTheme}></Switch>
                <Button variant="contained" color="secondary" type="submit" size="medium">
                    Logout
                </Button>
            </Stack>
    )
}

NavBar.defaultProps = {func :() => {console.log('No function provided')}}

NavBar.propTypes = {func : Function}

export default NavBar
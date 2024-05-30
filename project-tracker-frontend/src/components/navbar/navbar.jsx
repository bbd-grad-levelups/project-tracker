import './navbar.css'
import { Switch, Button, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function NavBar({ darkMode, toggleDarkTheme }) {

    const theme = useTheme();

    return (
        <section className="navbar">
            <Stack direction={'row'} spacing={3} alignItems={'center'} justifyContent={'center'}>
                <Typography variant="body1">{theme.palette.mode} mode</Typography>
                <Switch checked={darkMode} onChange={toggleDarkTheme}></Switch>
                <Button variant="contained" color="secondary" type="submit" size="large">
                    Logout
                </Button>
            </Stack>
        </section>
    )
}

export default NavBar
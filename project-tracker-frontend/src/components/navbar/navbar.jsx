import './navbar.css'
import { Switch, Button, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from "../../assets/logo.svg";
import React, { useState } from 'react';

function NavBar({ darkMode, toggleDarkTheme, func = () => { console.log('No function provided') } }) {

    const theme = useTheme();
    var isAdmin = true;

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const themeWord = theme.palette.mode == 'dark' ? 'Dark' : 'Light'

    return (
        <React.Fragment>
            <Stack direction={'row'} spacing={3} alignItems={'center'} justifyContent={'center'} className="navbar">
                <img src={logo} className="logo" alt="Logo" onClick={() => func(-1)} />
                {isAdmin ? (
                    <>
                        <Button variant="contained" color="secondary" type="submit" size="medium" onClick={handleClickOpen}>Edit Project</Button>
                        <Button variant="contained" color="secondary" type="submit" size="medium">Edit Members</Button>
                        <Button variant="contained" color="secondary" type="submit" size="medium">Edit Links</Button>
                    </>
                ) : null
                }
                <Typography variant="body1">{themeWord} mode</Typography>
                <Switch checked={darkMode} onChange={toggleDarkTheme}></Switch>
                <Button variant="contained" onClick={logout} color="secondary" type="submit" size="medium">
                    Logout
                </Button>
                <img src='.\src\assets\project-logo.png' alt='login-symbol' style={{ height: 3.5 + 'rem', mixBlendMode: 'unset', marginLeft: '2rem' }}></img>
            </Stack>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const projectName = formJson.projectName;
                        console.log(projectName);
                        console.log(formJson);
                        //TODO: update project
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill in any fields you would like to update.
                    </DialogContentText>
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        name="projectName"
                        label="Project Name"
                        inputMode="text"
                        fullWidth={true}
                        type="text"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        inputProps={{ maxLength: 5 }}
                        required
                        name="projectAbbreviation"
                        label="Project Abbreviation"
                        inputMode="text"
                        fullWidth={true}
                        type="text"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        name="projectDescription"
                        label="Project Description"
                        inputMode="text"
                        multiline
                        maxRows={4}
                        fullWidth={true}
                        type="text"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        inputProps={{ maxLength: 5 }}
                        required
                        name="accessUser"
                        label="Access User"
                        helperText="Your Jira user"
                        inputMode="text"
                        fullWidth={true}
                        type="text"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        inputProps={{ maxLength: 5 }}
                        required
                        name="accessKey"
                        label="Access Key"
                        helperText="Your users' Jira access key"
                        inputMode="text"
                        fullWidth={true}
                        type="text"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        name="jiraLink"
                        label="Jira Link"
                        inputMode="url"
                        fullWidth={true}
                        type="url"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        name="confluenceLink"
                        label="Confluence Link"
                        inputMode="url"
                        fullWidth={true}
                        required
                        type="url"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        name="githubLink"
                        label="Github Link"
                        inputMode="url"
                        fullWidth={true}
                        required
                        type="url"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

NavBar.propTypes = { func: Function }

function logout() {
    const url = "https://test-project.auth.eu-west-1.amazoncognito.com/logout?client_id=1echqqb1svir38d3quu5qsu63r&logout_uri=http://localhost:5173/login";
    sessionStorage.clear();
    location.href = url;
}
export default NavBar
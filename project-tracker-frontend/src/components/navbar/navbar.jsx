import './navbar.css'
import { useMediaQuery, Tooltip, Menu, MenuItem, ListItemIcon, Button, Typography, Box, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Autocomplete, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from "../../assets/logo.svg";
import React, { useState, useEffect } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonRemove from '@mui/icons-material/PersonRemove';
import Settings from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

function NavBar({ darkMode, toggleDarkTheme, func = () => { console.log('No function provided') }, project }) {

    const theme = useTheme();
    var isAdmin = true;

    const [open, setOpen] = useState(false);
    const [memberOpen, setMemberOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [projectData, setProjectData] = useState(undefined);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const projectOpen = Boolean(anchorEl);
    const [userInfo, setUserInfo] = useState(undefined);
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const getUserInfo = async () => {
        try {
            const response = await fetch(`https://test-project.auth.eu-west-1.amazoncognito.com/oauth2/userInfo`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
            });
            const data = await response.json();
            // console.log('Success:', data);
            setUserInfo(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleClickOpen = async () => {
        if (Object.keys(project).length > 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/info?projectName=${project.name}}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                const data = await response.json();
                console.log('Success:', data);
                setProjectData(data);
            } catch (error) {
                console.error('Error:', error);
            }

            setOpen(true);
        }
        else {
            setErrorOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleErrorClose = () => {
        setErrorOpen(false);
    };

    const handleMemberClickOpen = () => {
        if (Object.keys(project).length > 0) {
            setMemberOpen(true);
        }
        else {
            setErrorOpen(true);
        }

    };

    const handleMemberClose = () => {
        setMemberOpen(false);
    };

    const handleDeleteClickOpen = () => {
        if (Object.keys(project).length > 0) {
            setDeleteOpen(true);
        }
        else {
            setErrorOpen(true);
        }

    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    const handleDeleteProject = async () => {
        try {
            let response;
            if (isAdmin && Object.keys(project).length > 0) {
                response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/delete?projectName=${project.name}}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer' + sessionStorage.getItem("idToken")
                    },
                });
                const data = await response.json();
                console.log('Success:', data);
            }
            else if (Object.keys(project).length > 0) {
                // TODO: Call endpoint to remove project from user projects
                const data = await response.json();
                console.log('Success:', data);
            }
            else {
                setErrorOpen(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleProjectClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProjectClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <img src='..\src\assets\project-logo.png' edge="start" className="logo" alt="Logo" onClick={() => func(-1)} />
                        {!isSmallScreen && <Typography variant='h5' color={'inherit'}>Project Tracker</Typography>}
                        <Typography sx={{ flexGrow: 1, mr: 1, ml: 1 }}></Typography>
                        {!isSmallScreen && <Typography variant='body1' id='nav-username'>Hi {userInfo && userInfo.nickname ? userInfo.nickname : ''}</Typography>}
                        <Tooltip title='Display Mode'>
                            <IconButton sx={{
                                ml: 2, mr: 1, '&:focus': {
                                    outline: 'none',
                                }
                            }} onClick={toggleDarkTheme} color="inherit" size='large'>
                                {theme.palette.mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Tooltip>
                        {isAdmin ? (
                            <>
                                <Tooltip title='Project Settings'>
                                    <IconButton
                                        onClick={handleProjectClick}
                                        size='large'
                                        sx={{
                                            mr: 2, '&:focus': {
                                                outline: 'none',
                                            }
                                        }}
                                        color="inherit"
                                        aria-controls={projectOpen ? 'project-menu' : undefined}
                                        aria-haspopup='true'
                                        aria-expanded={projectOpen ? 'true' : undefined}
                                    >
                                        <Settings />
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : null}
                        <Button variant="contained" onClick={logout} color="secondary" type="submit" size="small">
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>

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
                        inputProps={{ maxLength: 2048 }}
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
                    <Button color='warning' type="submit">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={memberOpen}
                onClose={handleMemberClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const projectName = formJson.projectName;
                        console.log(projectName);
                        console.log(formJson);
                        //TODO: update members
                        handleMemberClose();
                    },
                }}
            >
                <DialogTitle>Edit Members</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select the member you would like to remove.
                    </DialogContentText>
                    <Autocomplete
                        fullWidth={true}
                        id="member-select"
                        options={['test1', 'test2']}
                        sx={{ mt: 2 }}
                        renderInput={(params) => <TextField {...params} label="Member" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleMemberClose}>Cancel</Button>
                    <Button color='warning' type="submit">Remove</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="delete-project-title"
                aria-describedby="delete-project-description"
            >
                <DialogTitle id="delete-project-title">
                    {isAdmin ? "Delete Project" : "Leave Project"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-project-description">
                        {isAdmin ?
                            "Do you want to delete this project for all users?"
                            :
                            "Do you want to leave this project?"
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} autoFocus>No</Button>
                    <Button color='error' onClick={() => { handleDeleteClose(); handleDeleteProject(); }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={errorOpen}
                onClose={handleErrorClose}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">
                    {"No project selected"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        Please select a project to use this function.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorClose}>OK</Button>
                </DialogActions>
            </Dialog>

            <Menu
                anchorEl={anchorEl}
                id="project-menu"
                open={projectOpen}
                onClose={handleProjectClose}
                onClick={handleProjectClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {isAdmin &&
                    <Box>
                        <MenuItem onClick={() => { handleProjectClose(); handleClickOpen(); }}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Edit Project
                        </MenuItem>
                        <MenuItem onClick={() => { handleProjectClose(); handleMemberClickOpen(); }}>
                            <ListItemIcon>
                                <PersonRemove fontSize="small" />
                            </ListItemIcon>
                            Edit Project Members
                        </MenuItem>
                        <MenuItem onClick={() => { handleDeleteClose(); handleDeleteClickOpen(); }}>
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            Delete Project
                        </MenuItem>
                    </Box>
                }
                {!isAdmin &&
                    <MenuItem onClick={() => { handleDeleteClose(); handleDeleteClickOpen(); }}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        Remove Project
                    </MenuItem>
                }

            </Menu>
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

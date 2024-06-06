import './navbar.css'
import { useMediaQuery, Alert, Tooltip, Menu, MenuItem, ListItemIcon, Button, Typography, Box, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Autocomplete, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from "../../assets/project-logo.png";
import React, { useState, useEffect } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonRemove from '@mui/icons-material/PersonRemove';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

function NavBar({ darkMode, toggleDarkTheme, func = () => { console.log('No function provided') }, project }) {

    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [memberOpen, setMemberOpen] = useState(false);
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [memberData, setMemberData] = useState(undefined);
    const [selectedMember, setSelectedMember] = useState(undefined);
    const [errorOpen, setErrorOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [projectData, setProjectData] = useState(undefined);
    const [anchorEl, setAnchorEl] = useState(undefined);
    const projectOpen = Boolean(anchorEl);
    const [userInfo, setUserInfo] = useState(undefined);
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const getUserInfo = async () => {
        try {
            const response = await fetch(`https://test-project.auth.eu-west-1.amazoncognito.com/oauth2/userInfo`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                },
            });
            if (!response.ok) {
                throw new Error(JSON.parse(await response.text()).error + '.');
            }
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            setErrorTitle('Failed to get user info');
            setErrorMessage('Please try again later.\nError: ' + error.message);
            setErrorOpen(true);
        }
    }

    const getAdmin = async () => {
        if (Object.keys(project).length > 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/admin?projectName=${project.name}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                if (!response.ok) {
                    throw new Error(JSON.parse(await response.text()).error + '.');
                }
                const data = await response.json();
                setIsAdmin(data.isAdmin);
            } catch (error) {
                setErrorTitle('Failed to get user access info for project');
                setErrorMessage('Please try again later.\nError: ' + error.message);
                setErrorOpen(true);
            }
        }
        else {
            setIsAdmin(false);
        }
    };

    const handleClickOpen = async () => {
        if (Object.keys(project).length > 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/info?projectName=${project.name}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                if (!response.ok) {
                    throw new Error(JSON.parse(await response.text()).error + '.');
                }
                const data = await response.json();
                setProjectData(data);
                setOpen(true);
            } catch (error) {
                setErrorTitle('Failed to get project info');
                setErrorMessage('Please try again later.\nError: ' + error.message);
                setErrorOpen(true);
            }
        }
        else {
            setErrorTitle('No Project Selected');
            setErrorMessage('Please select a project to use this function.');
            setErrorOpen(true);
        }
    };

    const updateProject = async (input) => {
        if (Object.keys(project).length > 0 && Object.keys(input).length > 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/change?projectName=${project.name}`
                    + `&abbreviation=${input.projectAbbreviation}`
                    + `&description=${input.projectDescription}`
                    + `&confluenceLink=${input.confluenceLink}`
                    + `&gitLink=${input.githubLink}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                if (!response.ok) {
                    throw new Error(JSON.parse(await response.text()).error + '.');
                }
                const data = await response.json();
                setProjectData(data);
            } catch (error) {
                setErrorTitle('Failed to update project');
                setErrorMessage('Please try again later.\nError: ' + error.message);
                setErrorOpen(true);
            }
        }
        else {
            setErrorTitle('No Project Selected');
            setErrorMessage('Please select a project to use this function.');
            setErrorOpen(true);
        }
    }

    const removeMember = async (input) => {
        if (!input) {
            setErrorTitle('No Member Selected');
            setErrorMessage('Please select a member to use this function.');
            setErrorOpen(true);
            return;
        }
        if (Object.keys(project).length > 0 && Object.keys(input).length > 0) {
            if (input.label === userInfo.nickname && isAdmin) {
                setErrorTitle('Failed to remove member');
                setErrorMessage('You cannot remove a project admin');
                setErrorOpen(true);
            }
            else {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/remove?projectName=${project.name}&userID=${input.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                        },
                    });
                    if (!response.ok) {
                        throw new Error(JSON.parse(await response.text()).error + '.');
                    }
                } catch (error) {
                    setErrorTitle('Failed to remove member');
                    setErrorMessage('Please try again later.\nError: ' + error.message);
                    setErrorOpen(true);
                }
            }
        }
        else {
            setErrorTitle('No Project Selected');
            setErrorMessage('Please select a project to use this function.');
            setErrorOpen(true);
        }
    }

    const addMember = async (input) => {
        if (!isAdmin) {
            setErrorTitle('Failed to add member');
            setErrorMessage('You are not an admin');
            setErrorOpen(true);
            return;
        }
        if (Object.keys(project).length > 0 && Object.keys(input).length > 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/add?projectName=${project.name}&userEmail=${input.userEmail}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                if (!response.ok) {
                    throw new Error(JSON.parse(await response.text()).error + '.');
                }
                const data = await response.json();
            } catch (error) {
                setErrorTitle('Failed to add member');
                setErrorMessage('Please check if user is registered and try again later.\nError: ' + error.message);
                setErrorOpen(true);
            }
        }
        else {
            setErrorTitle('No Project Selected');
            setErrorMessage('Please select a project to use this function.');
            setErrorOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleErrorClose = () => {
        setErrorOpen(false);
    };

    const handleMemberClickOpen = async () => {
        if (Object.keys(project).length > 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/users?projectName=${project.name}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                if (!response.ok) {
                    throw new Error(JSON.parse(await response.text()).error + '.');
                }
                const data = await response.json();
                setMemberData(data);
                setMemberOpen(true);
            } catch (error) {
                setErrorTitle('Failed to fetch project members');
                setErrorMessage('Please try again later.\nError: ' + error.message);
                setErrorOpen(true);
            }
        }
        else {
            setErrorTitle('No Project Selected');
            setErrorMessage('Please select a project to use this function.');
            setErrorOpen(true);
        }
    };

    const handleMemberClose = () => {
        setMemberOpen(false);
    };

    const handleAddMemberClose = () => {
        setAddMemberOpen(false);
    };

    const handleAddMemberClickOpen = () => {
        setAddMemberOpen(true);
    };

    const handleDeleteClickOpen = () => {
        if (Object.keys(project).length > 0) {
            setDeleteOpen(true);
        }
        else {
            setErrorTitle('No Project Selected');
            setErrorMessage('Please select a project to use this function.');
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
                response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/remove?projectName=${project.name}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                if (!response.ok) {
                    throw new Error(JSON.parse(await response.text()).error + '.');
                }
                const data = await response.json();
            }
            else if (Object.keys(project).length > 0) {
                response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/remove?projectName=${project.name}&userName=${userInfo.nickname}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("idToken")
                    },
                });
                if (!response.ok) {
                    throw new Error(JSON.parse(await response.text()).error + '.');
                }
                const data = await response.json();
            }
            else {
                setErrorTitle('Failed to delete project');
                setErrorMessage('An error occurred. Please try again later.');
                setErrorOpen(true);
            }
        } catch (error) {
            setErrorTitle('Failed to delete project');
            setErrorMessage('Please try again later.\nError: ' + error.message);
            setErrorOpen(true);
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
        getAdmin();
    }, [project]);

    return (
        <React.Fragment>
            {/* NAVBAR */}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <img src={logo} edge="start" className="logo" alt="Logo" onClick={() => func(-1)} />
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
                        <Button variant="contained" onClick={logout} color="secondary" type="submit" size="small">
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>

            {/* EDIT PROJECT */}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        updateProject(formJson);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please modify any fields you would like to update.
                    </DialogContentText>
                    <TextField
                        inputProps={{ maxLength: 8 }}
                        required
                        name="projectAbbreviation"
                        label="Project Abbreviation"
                        inputMode="text"
                        fullWidth={true}
                        type="text"
                        autoFocus
                        margin="dense"
                        variant="standard"
                        defaultValue={projectData && projectData.abbreviation}
                    />
                    <TextField
                        inputProps={{ maxLength: 2048 }}
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
                        defaultValue={projectData && projectData.description}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        name="confluenceLink"
                        label="Confluence Link"
                        inputMode="url"
                        fullWidth={true}
                        type="url"
                        autoFocus
                        margin="dense"
                        variant="standard"
                        defaultValue={projectData && projectData.confluence}
                    />
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        name="githubLink"
                        label="Github Link"
                        inputMode="url"
                        fullWidth={true}
                        type="url"
                        autoFocus
                        margin="dense"
                        variant="standard"
                        defaultValue={projectData && projectData.git}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button color='warning' type="submit">Save</Button>
                </DialogActions>
            </Dialog>

            {/* ADD USERS */}
            <Dialog
                open={addMemberOpen}
                onClose={handleAddMemberClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        addMember(formJson);
                        handleAddMemberClose();
                    },
                }}
            >
                <DialogTitle>Add User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the user's email that you would like to add.
                    </DialogContentText>
                    <TextField
                        inputProps={{ maxLength: 255 }}
                        required
                        name="userEmail"
                        label="User Email"
                        inputMode="email"
                        fullWidth={true}
                        type="email"
                        autoFocus
                        margin="dense"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddMemberClose}>Cancel</Button>
                    <Button color='warning' type="submit">Save</Button>
                </DialogActions>
            </Dialog>

            {/* REMOVE USERS */}
            <Dialog
                open={memberOpen}
                onClose={handleMemberClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        removeMember(selectedMember);
                        handleMemberClose();
                    },
                }}
            >
                <DialogTitle>Remove Members</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select the member you would like to remove.
                    </DialogContentText>
                    <Autocomplete
                        fullWidth={true}
                        id="member-select"
                        options={memberData && memberData ? memberData : []}
                        onChange={(event, newValue) => {
                            setSelectedMember(newValue);
                        }}
                        sx={{ mt: 2 }}
                        renderInput={(params) => <TextField {...params} label="Member" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleMemberClose}>Cancel</Button>
                    <Button color='warning' type="submit">Remove</Button>
                </DialogActions>
            </Dialog>

            {/* DELETE PROJECT */}
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

            {/* ERROR DIALOG */}
            <Dialog
                open={errorOpen}
                onClose={handleErrorClose}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">
                    {errorTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorClose}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* SETTINGS MENU */}
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
                            Remove Project Members
                        </MenuItem>
                        <MenuItem onClick={() => { handleProjectClose(); handleAddMemberClickOpen(); }}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            Add Project Members
                        </MenuItem>
                        <MenuItem onClick={() => { handleProjectClose(); handleDeleteClickOpen(); }}>
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            Delete Project
                        </MenuItem>
                    </Box>
                }
                {!isAdmin &&
                    <MenuItem onClick={() => { handleProjectClose(); handleDeleteClickOpen(); }}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        Leave Project
                    </MenuItem>
                }
            </Menu>
        </React.Fragment>
    )
}

NavBar.propTypes = { func: Function }

function logout() {
    const url = `https://test-project.auth.eu-west-1.amazoncognito.com/logout?client_id=1echqqb1svir38d3quu5qsu63r&logout_uri=${window.location.protocol}//${window.location.host}/login`;
    console.log(url);
    sessionStorage.clear();
    location.href = url;
}
export default NavBar

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ProjectGrid from '../components/project-grid/project-grid'
import '../App.css'
import SideBar from '../components/sidebar/sidebar'
import NavBar from '../components/navbar/navbar'
import UnselectedContainer from '../components/unselected-container/unselected-container'
import CreateProject from '../components/create-project/create-project'
import { CssBaseline } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { darkTheme, lightTheme } from "../theme.jsx"

const local = false;
const base_url = local ? "http://localhost:3000" : "https://api.project-tracker.projects.bbdgrad.com"

function isTokenExpired(token) {
    if (!token) {
        return true;
    }
    try {
        const decodedToken = jwtDecode(token);
        //console.log(decodedToken);
        const currentTime = Date.now() / 1000;
        //console.log(currentTime);
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return true;
    }
}

function HomePage() {

    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkTheme = () => {
        setDarkMode(!darkMode);
    };

    const theme = darkMode ? darkTheme : lightTheme;

    const [selectedItem, setSelectedItem] = useState(-2)

    const [projects, setProjects] = useState([]);
    useEffect(() => {
        try {
            if (!sessionStorage.getItem("idToken")) {
                location.href = window.location.protocol + "//" + window.location.host + "/login";
            }
            else if (isTokenExpired(sessionStorage.getItem("token"))) {
                console.log("EXPIRED");
                const url = `https://test-project.auth.eu-west-1.amazoncognito.com/logout?client_id=1echqqb1svir38d3quu5qsu63r&logout_uri=${window.location.protocol}//${window.location.host}/login`;
                sessionStorage.clear();
                location.href = url;
            }
            else {
                getProjectData();
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    const getProjectData = () => {
        fetch(`${base_url}/project/projects`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${sessionStorage.getItem("idToken")}` }
        })
            .then((response) => response.json())
            .then((data) => {
                setProjects(data.projectDetails);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <div className='page'>
                <NavBar darkMode={darkMode} toggleDarkTheme={toggleDarkTheme} func={setSelectedItem} getProjectData={getProjectData} project={projects && projects[selectedItem] ? projects[selectedItem] : {}} />
                <div className='content'>
                    <SideBar func={setSelectedItem} projects={projects}></SideBar>
                    {selectedItem >= 0 ? (
                        <ProjectGrid key={projects[selectedItem].name} project={projects[selectedItem]}></ProjectGrid>
                    ) : selectedItem == -1 ? (
                        <CreateProject setSelectedItem={setSelectedItem} setProjects={setProjects} projects={projects}></CreateProject>
                    ) : <UnselectedContainer></UnselectedContainer>}
                </div>
            </div>
        </ThemeProvider>
    )
}

export default HomePage
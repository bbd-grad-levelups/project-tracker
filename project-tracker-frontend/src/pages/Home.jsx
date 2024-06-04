import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ProjectGrid from '../components/project-grid/project-grid'
import '../App.css'
import SideBar from '../components/sidebar/sidebar'
import NavBar from '../components/navbar/navbar'
import UnselectedContainer from '../components/unselected-container/unselected-container'
import CreateProject from '../components/create-project/create-project'
import { CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from "../theme.jsx"
import backendPath from '../main.jsx'

function HomePage() {
    try {
        if (!sessionStorage.getItem("token")) {
            location.href = window.location.protocol + "//" + window.location.host + "/login";
        }
    } catch (e) {
        console.log(e);
    }

    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkTheme = () => {
        setDarkMode(!darkMode);
    };

    const theme = darkMode ? darkTheme : lightTheme;

    const [selectedItem, setSelectedItem] = useState(-2)

    const [projects, setProjects] = useState([]);
    useEffect(() => {
        fetch(`${backendPath}/project/projects`, {method: "GET",
            headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}})
            .then((response) => response.json())
            .then((data) => {
                setProjects(data.projectDetails);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <div className='page'>
                <NavBar darkMode={darkMode} toggleDarkTheme={toggleDarkTheme} func={setSelectedItem} />
                <div className='content'>
                    <SideBar func={setSelectedItem} projects={projects}></SideBar>
                    {selectedItem >= 0 ? (
                        <ProjectGrid key={projects[selectedItem].name} projectName={projects[selectedItem].name}></ProjectGrid>
                    ) : selectedItem == -1 ? (
                        <CreateProject></CreateProject>
                    ) : <UnselectedContainer></UnselectedContainer>}
                </div>
            </div>
        </ThemeProvider>
    )
}

export default HomePage
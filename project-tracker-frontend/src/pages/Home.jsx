import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ProjectGrid from '../components/project-grid/project-grid'
import '../App.css'
import SideBar from '../components/sidebar/sidebar'
import NavBar from '../components/navbar/navbar'
import UnselectedContainer from '../components/unselected-container/unselected-container'
import CreateProject from '../components/create-project/create-project'
import { CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from "../theme.jsx"

function HomePage() {

    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkTheme = () => {
        setDarkMode(!darkMode);
    };

    const theme = darkMode ? darkTheme : lightTheme;

    const [selectedItem, setSelectedItem] = useState(-1)
    var projects = [{ id: 1, name: 'Project 1', members: [{ name: 'A', role: 'Team Lead', numTickets: 5 }, { name: 'B', role: 'Dev', numTickets: 15 }, { name: 'C', role: 'Dev', numTickets: 12 }] }, { id: 5, name: 'Project 2', members: [{ name: 'A', role: 'Team Lead', numTickets: 2 }] }]
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <div className='page'>
                <NavBar darkMode={darkMode} toggleDarkTheme={toggleDarkTheme} func={setSelectedItem}/>
                <div className='content'>
                    <SideBar func={setSelectedItem}></SideBar>
                    {selectedItem > 0 ? (
                        <>
                            {projects.map((project) => {
                                if (project.id == selectedItem) {
                                    return (
                                        <ProjectGrid key={project.name} project={project}></ProjectGrid>
                                    )
                                }
                            })}
                        </>
                    ) : selectedItem == 0 ? (
                        <CreateProject></CreateProject>
                    ) : <UnselectedContainer></UnselectedContainer>}
                </div>
            </div>
        </ThemeProvider>
    )
}

export default HomePage
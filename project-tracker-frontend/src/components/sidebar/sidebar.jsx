import './sidebar.css'
import { Button } from '@mui/material';

function SideBar({func = () => { console.log('No function provided') }, projects = []}) {
    return (
        <section className="sidebar">
                {projects.map((project) => {
                    return (
                        <Button key={project.name} className='projects-button' onClick={() => func(projects.indexOf(project))} size="medium">{project.tag}</Button>
                    )
                })}
                <Button className='create-project-button' onClick={() => func(-1)} size="medium">New Project</Button>
        </section>
    )
}

SideBar.propTypes = {func : Function}

export default SideBar
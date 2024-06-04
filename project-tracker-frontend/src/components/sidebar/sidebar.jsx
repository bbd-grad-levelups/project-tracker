import './sidebar.css'
import { Button } from '@mui/material';

function SideBar({func = () => { console.log('No function provided') }, projects = []}) {
    var count = -1;
    return (
        <section className="sidebar">
                {projects.map((project) => {
                    count += 1;
                    return (
                        <Button key={project.project_name} className='projects-button' onClick={() => func(count)} size="medium">{project.project_abbreviation}</Button>
                    )
                })}
                <Button className='create-project-button' onClick={() => func(-1)} size="medium">New Project</Button>
        </section>
    )
}

SideBar.propTypes = {func : Function}

export default SideBar
import './sidebar.css'
import { Switch, Button, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function SideBar(props) {
    var projects = [{id: 1, name : 'Project 1', members: [{name: 'A', role: 'Team Lead', numTickets: 5}, {name: 'B', role: 'Dev', numTickets: 15}, {name: 'C', role: 'Dev', numTickets: 12}]}, {id: 5, name : 'Project 2', members: [{name: 'A', role: 'Team Lead', numTickets: 2}]}]
    return (
        <section className="sidebar">
            {projects.map((project) => {
                return (
                    <Button key={project.id} className='projects-button' onClick={() => props.func(project.id)} size="medium">{project.name}</Button>
                )
            })}
            <Button className='create-project-button' onClick={() => props.func(0)} size="medium">New Project</Button>
        </section>
    )
}

SideBar.defaultProps = {func :() => {console.log('No function provided')}}

SideBar.propTypes = {func : Function}

export default SideBar
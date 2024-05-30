import './sidebar.css'

function SideBar(props) {
    var projects = [{id: 1, name : 'Project 1', members: [{name: 'A', role: 'Team Lead', numTickets: 5}, {name: 'B', role: 'Dev', numTickets: 15}, {name: 'C', role: 'Dev', numTickets: 12}]}, {id: 5, name : 'Project 2', members: [{name: 'A', role: 'Team Lead', numTickets: 2}]}]
    return (
        <section className="sidebar">
            {projects.map((project) => {
                return (
                    <button key={project.id} className='projects-button' onClick={() => props.func(project.id)}>{project.name}</button>
                )
            })}
            <button className='create-project-button' onClick={() => props.func(0)}>Create Project</button>
        </section>
    )
}

export default SideBar
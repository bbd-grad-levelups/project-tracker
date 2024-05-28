import ProjectGrid from '../project-grid/project-grid'

function ProjectContainer() {
    var projects = [{name : 'Project 1', members: [{name: 'A', role: 'Team Lead', numTickets: 5}, {name: 'B', role: 'Dev', numTickets: 15}, {name: 'C', role: 'Dev', numTickets: 12}]}, {name : 'Project 2', members: [{name: 'A', role: 'Team Lead', numTickets: 2}]}]
    return (
        <>
            <div>
                {projects.map((project) => {
                    return (
                        <ProjectGrid key = {project.name} project = {project}></ProjectGrid>
                    )
                })}
            </div>
        </>
    )
}

export default ProjectContainer
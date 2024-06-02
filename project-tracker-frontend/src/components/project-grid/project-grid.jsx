import { useState } from "react";
import gitLogo from "../../assets/Git.png"
import jiraLogo from "../../assets/Jira.png"
import confluenceLogo from "../../assets/Confluence.png"
import { Container, Select, MenuItem} from "@mui/material";
import './project-grid.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { render } from "react-dom";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ChartJS.register(ArcElement, Tooltip, Legend);


function ProjectGrid(props) {
    const [expanded, setExpanded] = useState(true);
    var projectName = props.project.name
    var members = props.project.members
    var startDate = Date.now().toString()
    var progress = 70
    var stage = 'QA'
    members = [{name: 'Thabo Ladubwe', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3},{name: '1', role: '2', numTickets: 3}]
    const pieData = {
        labels: members.map(member => {
            return member.name
        }),
        datasets: [
          {
            label: '# of Tickets',
            data: members.map(member => {
                return member.numTickets
            }),
            backgroundColor: [
              '#0a2351',
              '#1F305E',
              '#034694',
              '#0039a6',
              '#0047AB',
              '#1F75FE',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
        
    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          display: false
        },
        title: {
          display: true,
          text: 'Ticket Statuses',
        },
      },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            display: false
          },
          title: {
            display: true,
            position: 'left',
            text: 'Tickets per Member',
          },
        },
      };
        
    const barLabels = ['To Do', 'In Progress', 'Done'];
    
    const barData = {
      labels: barLabels,
      datasets: [
        {
          label: 'Number of Tickets',
          data: [1,5,6],
          backgroundColor: 'darkblue',
        }
      ],
    };
    const [board, setBoard] = useState('Board 1');

    const boards = [{boardName: 'Board 1'}, {boardName: 'Board 2'}]

    const handleChange = (event) => {
      setBoard(event.target.value);
    };

    
    return (
        <div className="project-grid">
            <Container>
                <div onClick={() => setExpanded(true)}>
                    <h2 className="project-title">{projectName}</h2>
                </div>
                {expanded ? (
                    <div className='project-dashboard'>
                        <section className="info-section">
                            <section className="members-section">
                                <div className="board">
                                    <Select
                                        id="demo-simple-select"
                                        value={board}
                                        onChange={handleChange}
                                        fullWidth
                                        
                                    >
                                        {boards.map((board) => {
                                                return (
                                                    <MenuItem key={board.boardName} value={board.boardName}>{board.boardName}</MenuItem>
                                                )
                                            })}
                                    </Select>
                                    <div className="table-section">   
                                        <table>
                                            <tr>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Number of tickets</th>
                                            </tr>
                                            {members.map((val, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td>{val.name}</td>
                                                        <td>{val.role}</td>
                                                        <td>{val.numTickets}</td>
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                    </div>
                                </div>
                                
                                
                                <div className="pie-chart">
                                    <Pie data={pieData} options={pieOptions}/>
                                </div>
                            </section>
                            <section className="progress-section">
                                <div className="bar-chart">
                                    <Bar options={barOptions} data={barData}/>
                                </div>
                                <article className="info-card">
                                    <h3>Start Date: {startDate}</h3>
                                    <h3>Current Progress: {progress}%</h3>
                                    <h3>Stage: {stage}</h3>
                                </article>
                            </section>
                        </section>
                        <section className="links-sections">
                            <a href="https://react.dev" target="_blank">
                                <img src={gitLogo} className="logo-git" alt="Git logo" />
                            </a> 
                            <a href="https://react.dev" target="_blank">
                                <img src={jiraLogo} className="logo-jira" alt="Jira logo" />
                            </a>
                            <a href="https://react.dev" target="_blank">
                                <img src={confluenceLogo} className="logo-confluence" alt="Confluence logo" />
                            </a>                     
                        </section>
                    </div>
                ) : null} 
            </Container>
        </div>
    )
}

ProjectGrid.defaultProps = {project : {name: '', members: []}}

ProjectGrid.propTypes = {project : Object}

export default ProjectGrid
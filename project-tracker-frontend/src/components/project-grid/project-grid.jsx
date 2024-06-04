import { useState, useEffect } from "react";
import gitLogo from "../../assets/Git.png"
import jiraLogo from "../../assets/Jira.png"
import confluenceLogo from "../../assets/Confluence.png"
import { Container, Select, MenuItem} from "@mui/material";
import './project-grid.css';
import backendPath from '../../main.jsx'
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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ChartJS.register(ArcElement, Tooltip, Legend);


function ProjectGrid({projectName = ''}) {
    const [expanded, setExpanded] = useState(true);

    const [board, setBoard] = useState('All Boards');

    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetch(`${backendPath}/project/boards/?projectName=${projectName}`, {method: "GET",
            headers: {"Authorization": `Bearer ${sessionStorage.getItem("idToken")}`}})
            .then((response) => response.json())
            .then((data) => {
                setBoards([{board_name: "All Boards"}].concat(data.boards));
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    
    const [projectLinks, setProjectLinks] = useState([]);
    useEffect(() => {
        fetch(`${backendPath}/project/info/?projectName=${projectName}`, {method: "GET",
            headers: {"Authorization": `Bearer ${sessionStorage.getItem("idToken")}`}})
            .then((response) => response.json())
            .then((data) => {
                setProjectLinks(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const [projectSummary, setProjectSummary] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    useEffect(() => {
        if (board=='All Boards'){
            fetch(`${backendPath}/project/summary/?projectName=${projectName}`, {method: "GET",
            headers: {"Authorization": `Bearer ${sessionStorage.getItem("idToken")}`}})
            .then((response) => response.json())
            .then((data) => {
                setProjectSummary(data.summary);
                setProjectMembers(data.users);
            })
            .catch((err) => {
                console.log(err.message);
            });
        } else {
            fetch(`${backendPath}/board/summary/?projectName=${projectName}&boardName=${board}`, {method: "GET",
            headers: {"Authorization": `Bearer ${sessionStorage.getItem("idToken")}`}})
            .then((response) => response.json())
            .then((data) => {
                setProjectSummary(data.summary);
                setProjectMembers(data.users);
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
        
    }, [board]);
    var members = []

    for (var label in projectMembers) {
        members.push({name: label, numTickets: projectMembers[label]})
    }

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
        
    var barLabels = [];
    var barLabelData = [];
    
    for (var bLabel in projectSummary) {
        barLabels.push(bLabel)
        barLabelData.push(projectSummary[bLabel]);
    }
    
    const barData = {
      labels: barLabels,
      datasets: [
        {
          label: 'Number of Tickets',
          data: barLabelData,
          backgroundColor: 'darkblue',
        }
      ],
    };
    

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
                                                    <MenuItem key={board.board_name} value={board.board_name}>{board.board_name}</MenuItem>
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
                                    <p>{projectLinks.description}</p>
                                </article>
                            </section>
                        </section>
                        <section className="links-sections">
                            <a href={projectLinks.git} target="_blank">
                                <img src={gitLogo} className="logo-git" alt="Git logo" />
                            </a> 
                            <a href={projectLinks.jira} target="_blank">
                                <img src={jiraLogo} className="logo-jira" alt="Jira logo" />
                            </a>
                            <a href={projectLinks.confluence} target="_blank">
                                <img src={confluenceLogo} className="logo-confluence" alt="Confluence logo" />
                            </a>                     
                        </section>
                    </div>
                ) : null} 
            </Container>
        </div>
    )
}

ProjectGrid.propTypes = {projectName : String}

export default ProjectGrid
import { useState } from 'react'
import ProjectContainer from '../components/projects-container/projects-container'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className='page'>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Home</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/pages/Home.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ProjectContainer></ProjectContainer>
      
    </div>
  )
}

export default HomePage
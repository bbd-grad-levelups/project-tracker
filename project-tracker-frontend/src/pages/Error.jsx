import { useState } from 'react'
import '../App.css'

function ErrorPage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Error</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/pages/Error.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default ErrorPage
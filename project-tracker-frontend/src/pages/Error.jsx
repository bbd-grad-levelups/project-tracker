import '../App.css'

function ErrorPage() {

  return (
    <>
      <h1>Oops we seem to have had an error</h1>
      <div className="card">
        <p>
          Either you're in the wrong place or we messed up
        </p>
      </div>
      <p className="read-the-docs">
        Click button to return to home
      </p>
      <a href='/'><button>Click Me</button></a>
    </>
  )
}

export default ErrorPage
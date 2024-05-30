import './navbar.css'
import logo from "../../assets/logo.svg"

function NavBar(props) {
    var isAdmin = true;
    return (
        <section className="navbar">
            <img src={logo} className="logo" alt="Logo" onClick={() => props.func(-1)}/>
            {isAdmin ? (
                <>
                    <button>Edit Project</button>
                    <button>Edit Members</button>
                    <button>Edit Links</button>
                </>
            ) : null
            }
            
            <button className='logout-button'>Logout</button>
        </section>
    )
}

NavBar.defaultProps = {func :() => {console.log('No function provided')}}

NavBar.propTypes = {func : Function}

export default NavBar
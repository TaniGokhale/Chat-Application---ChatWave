import { Link, useNavigate } from "react-router-dom"

function Navbar(){

const navigate = useNavigate()
const token = localStorage.getItem("token")
const userName = localStorage.getItem("userName")

const handleLogout = ()=>{
localStorage.clear()
navigate("/login")
}

return(

<div className="navbar">

<h2 className="logo">💬 ChatWave</h2>

<div className="nav-right">

{token ? (
<>
<span className="username">👤 {userName}</span>
<button onClick={handleLogout}>Logout</button>
</>
):(
<>
<Link to="/login">Login</Link>
<Link to="/signup">Signup</Link>
</>
)}

</div>

</div>

)

}

export default Navbar

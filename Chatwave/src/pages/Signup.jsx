import { useState } from "react"
import { signup } from "../services/api"
import { useNavigate } from "react-router-dom"
import "../styles/Auth.css"
function Signup(){

const [name,setName]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const navigate = useNavigate()

const handleSignup = async()=>{

await signup({name,email,password})

navigate("/login")
}

return(

<div className="auth-container">

<h2>Signup</h2>

<input placeholder="Name" onChange={(e)=>setName(e.target.value)} />
<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
<input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)} />

<button onClick={handleSignup}>Signup</button>

</div>

)

}

export default Signup
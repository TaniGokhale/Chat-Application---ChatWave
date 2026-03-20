import { useState } from "react"
import { login } from "../services/api"
import { useNavigate } from "react-router-dom"

function Login(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const navigate = useNavigate()

const handleLogin = async()=>{

const res = await login({email,password})

localStorage.setItem("token",res.data.token)
localStorage.setItem("userId",res.data.user._id)
localStorage.setItem("userName",res.data.user.name)

navigate("/chat")
}

return(

<div className="auth-container">

<h2>Login</h2>

<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
<input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)} />

<button onClick={handleLogin}>Login</button>

</div>

)

}

export default Login
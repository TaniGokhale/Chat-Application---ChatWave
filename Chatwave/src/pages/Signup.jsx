import {useState} from "react"
import API from "../services/api"

function Signup(){

const [name,setName]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")

const handleSignup=async()=>{

await API.post("/auth/signup",{
name,email,password
})

alert("Signup successful")

}

return(

<div className="auth">

<h2>ChatWave Signup</h2>

<input placeholder="Name" onChange={(e)=>setName(e.target.value)} />

<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />

<input placeholder="Password" type="password"
onChange={(e)=>setPassword(e.target.value)} />

<button onClick={handleSignup}>Signup</button>

</div>

)

}

export default Signup
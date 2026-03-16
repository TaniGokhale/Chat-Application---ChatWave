import {useEffect,useState} from "react"
import {getUsers} from "../services/api"

function Sidebar({setReceiver}){

const [users,setUsers]=useState([])

useEffect(()=>{

loadUsers()

},[])

const loadUsers = async()=>{
const res = await getUsers()
setUsers(res.data)
}

return(

<div className="sidebar">

<h2>ChatWave</h2>

{users.map((user)=>(
<div
key={user._id}
className="user"
onClick={()=>setReceiver(user)}
>
{user.name}
</div>
))}

</div>

)

}

export default Sidebar
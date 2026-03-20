import { useEffect, useState } from "react"
import { getUsers } from "../services/api"
import socket from "../socket/socket"

function Sidebar({setReceiver}){

const [users,setUsers]=useState([])
const [unread,setUnread]=useState({})

useEffect(()=>{
loadUsers()
},[])

useEffect(()=>{

socket.on("receiveMessage",(data)=>{

// agar current chat open nahi hai
setUnread(prev=>({
...prev,
[data.senderId]: (prev[data.senderId] || 0) + 1
}))

})

return ()=> socket.off("receiveMessage")

},[])

const loadUsers = async ()=>{
const res = await getUsers()
setUsers(res.data)
}

const handleUserClick = (user)=>{
setReceiver(user)

// unread reset
setUnread(prev=>({
...prev,
[user._id]: 0
}))
}

return(

<div className="sidebar">

{users.map((user)=>(
<div
key={user._id}
className="user"
onClick={()=>handleUserClick(user)}
>

{user.name}

{/* unread badge */}
{unread[user._id] > 0 && (
<span className="badge">
{unread[user._id]}
</span>
)}

</div>
))}

</div>

)

}

export default Sidebar
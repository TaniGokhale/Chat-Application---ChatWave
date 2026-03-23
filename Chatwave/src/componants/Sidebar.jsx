import { useEffect, useState } from "react"
import { getUsers, getMessages } from "../services/api"
import { io } from "socket.io-client"
import "../styles/Sidebar.css"

const socket = io("http://localhost:5000")

function Sidebar({ setReceiver }) {

const [users, setUsers] = useState([])
const [unreadCounts, setUnreadCounts] = useState({})
const [lastMsgTime, setLastMsgTime] = useState({})

const currentUserId = localStorage.getItem("userId")

useEffect(() => {
  fetchUsers()

  socket.on("receiveMessage", (data) => {

    
    if (data.senderId !== currentUserId) {
      setUnreadCounts(prev => ({
        ...prev,
        [data.senderId]: (prev[data.senderId] || 0) + 1
      }))
    }

   
    setLastMsgTime(prev => ({
      ...prev,
      [data.senderId]: new Date()
    }))

  })

}, [])

const fetchUsers = async () => {
  const res = await getUsers()
  const usersData = res.data

  let unreadMap = {}
  let timeMap = {}

  for (let user of usersData) {
    try {
      const msgRes = await getMessages(currentUserId, user._id)
      const msgs = msgRes.data

      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1]

        timeMap[user._id] = new Date(lastMsg.createdAt)

        
        const unread = msgs.filter(
          m => m.senderId === user._id && !m.seen
        ).length

        if (unread > 0) {
          unreadMap[user._id] = unread
        }
      }

    } catch (err) {
      console.log(err)
    }
  }

  setUnreadCounts(unreadMap)
  setLastMsgTime(timeMap)

  const sorted = usersData.sort((a, b) => {
    return (timeMap[b._id] || 0) - (timeMap[a._id] || 0)
  })

  setUsers(sorted)
}

return (

<div>

{users.map((user)=>(

  <div 
    key={user._id} 
    className="user"
    onClick={()=>{
      setReceiver(user)

      
      setUnreadCounts(prev => ({
        ...prev,
        [user._id]: 0
      }))
    }}
  >

    <img 
      src={user.profilePic || "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"} 
      alt=""
    />

    <span style={{
      fontWeight: unreadCounts[user._id] ? "bold" : "normal"
    }}>
      {user.name}
    </span>

    
    {unreadCounts[user._id] > 0 && (
      <span style={{
        marginLeft: "auto",
        background: "#ff4da6",
        color: "white",
        borderRadius: "50%",
        padding: "4px 8px",
        fontSize: "12px"
      }}>
        {unreadCounts[user._id]}
      </span>
    )}

  </div>

))}

</div>

)

}

export default Sidebar
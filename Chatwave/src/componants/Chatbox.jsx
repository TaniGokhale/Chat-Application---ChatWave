import { useState, useEffect } from "react"
import socket from "../socket/socket"
import { sendMessage, getMessages } from "../services/api"

function ChatBox({ receiver }) {

const [message, setMessage] = useState("")
const [messages, setMessages] = useState([])

const senderId = localStorage.getItem("userId")

useEffect(() => {

if(receiver){
loadMessages()
}

socket.on("receiveMessage",(data)=>{
setMessages(prev=>[...prev,data])
})

return ()=> socket.off("receiveMessage")

},[receiver])

const loadMessages = async () => {

try{

const res = await getMessages(senderId,receiver._id)

setMessages(res.data)

}catch(err){
console.log(err)
}

}

const handleSend = async () => {

if(!message.trim()) return

try{

const msgData = {
senderId,
receiverId: receiver._id,
message
}

await sendMessage(msgData)

socket.emit("sendMessage", msgData)

setMessages(prev => [...prev, msgData])

setMessage("")

}catch(err){
console.log(err)
}

}

return (

<div className="chatbox">

{receiver ? (

<>

<div className="messages">

{messages.map((msg,i)=>(

<div
key={i}
className={
msg.senderId === senderId
? "message sent"
: "message received"
}
>

{msg.message}

</div>

))}

</div>

<div className="input-area">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Type message..."
/>

<button onClick={handleSend}>Send</button>

</div>

</>

):(

<div style={{margin:"auto"}}>
Select a user to start chat
</div>

)}

</div>

)

}

export default ChatBox
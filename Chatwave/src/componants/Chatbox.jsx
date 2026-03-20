import { useState, useEffect, useRef } from "react"
import socket from "../socket/socket"
import { sendMessage, getMessages } from "../services/api"

function ChatBox({receiver}){

const [message,setMessage]=useState("")
const [messages,setMessages]=useState([])
const messagesEndRef = useRef(null)

const senderId = localStorage.getItem("userId")

useEffect(()=>{

if(receiver){
loadMessages()
}

socket.on("receiveMessage",(data)=>{
setMessages(prev=>[...prev,data])
})

return ()=> socket.off("receiveMessage")

},[receiver])

useEffect(()=>{
messagesEndRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])

const loadMessages = async()=>{
const res = await getMessages(senderId,receiver._id)
setMessages(res.data)
}

const handleSend = async()=>{

if(!message.trim()) return

const msgData={
senderId,
receiverId:receiver._id,
message
}

await sendMessage(msgData)

socket.emit("sendMessage",msgData)

// ❌ REMOVE DUPLICATE ADD
// setMessages(prev=>[...prev,msgData])

setMessage("")
}

return(

<div className="chatbox">

{receiver ? (

<>

<div className="chat-header">
{receiver.name}
</div>

<div className="messages">

{messages.map((msg,i)=>(

<div
key={i}
className={
msg.senderId === senderId
? "message sent"
: "message received new"
}
>
{msg.message}
</div>

))}

<div ref={messagesEndRef}></div>

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
<div className="empty-chat">
Select a user to start chat
</div>
)}

</div>

)

}

export default ChatBox
import Sidebar from "../components/Sidebar"
import ChatBox from "../components/ChatBox"
import { useState } from "react"

function ChatPage(){

const [receiver,setReceiver] = useState(null)

return(
<div className="chat-container">

<Sidebar setReceiver={setReceiver}/>
<ChatBox receiver={receiver}/>

</div>
)

}

export default ChatPage
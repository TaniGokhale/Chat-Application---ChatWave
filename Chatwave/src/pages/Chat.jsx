import {useState} from "react"
import Sidebar from "../componants/Sidebar"
import ChatBox from "../componants/Chatbox"

function Chat(){

const [receiver,setReceiver] = useState(null)

return(

<div className="app">

<Sidebar setReceiver={setReceiver}/>

<ChatBox receiver={receiver}/>

</div>

)

}

export default Chat
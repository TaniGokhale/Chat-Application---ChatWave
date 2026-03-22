import { useState } from "react"
import Sidebar from "../componants/Sidebar"
import Chatbox from "../componants/Chatbox"
import "../styles/ChatPage.css"

function ChatPage() {

  const [receiver, setReceiver] = useState(null)

  return (
    <div className="chat-container">

      {/*  USER LIST SCREEN */}
      {!receiver && (
        <div className="user-list-screen">
          <h2>💬 Chats</h2>
          <Sidebar setReceiver={setReceiver} />
        </div>
      )}

      {/* CHAT SCREEN */}
      {receiver && (
        <div className="chat-screen">
          <Chatbox 
            receiver={receiver} 
            setReceiver={setReceiver} 
          />
        </div>
      )}

    </div>
  )
}

export default ChatPage
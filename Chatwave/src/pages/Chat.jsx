import { useState } from "react"
import Sidebar from "../componants/Sidebar"
import ChatBox from "../componants/Chatbox.jsx"
import Profile from "../pages/Profile.jsx"
import "../styles/chat.css"

function Chat() {

const [receiver, setReceiver] = useState(null)
const [showProfile, setShowProfile] = useState(false)   

  return (

    <div className="app">

      <Sidebar setReceiver={(user) => {
        setReceiver(user)
        setShowProfile(false) 
      }} />

     
     <ChatBox 
  receiver={receiver} 
  setReceiver={setReceiver}
  openProfile={() => setShowProfile(true)}   
/>

      {showProfile && receiver && (
        <div className="card profile-card-wrapper">
          <Profile 
            user={receiver} 
            onBack={() => setShowProfile(false)} 
          />
        </div>
      )}

    </div>

  )
}

export default Chat
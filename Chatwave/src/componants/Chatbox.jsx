import { useState, useEffect, useRef } from "react"
import { sendMessage, getMessages, sendFile } from "../services/api"
import { io } from "socket.io-client"
import EmojiPicker from "emoji-picker-react"
import "../styles/ChatBox.css"

const socket = io("http://localhost:5000")

function Chatbox({ receiver, openProfile }) {

  if (!receiver) return <div className="empty">Select user</div>

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [recording, setRecording] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const [typingUser, setTypingUser] = useState("")
  const [onlineUsers, setOnlineUsers] = useState([])

  const mediaRecorderRef = useRef(null)
  const senderId = localStorage.getItem("userId")

  useEffect(() => {
    loadMessages()

    socket.emit("join", senderId)

    socket.on("onlineUsers", (data) => {
      setOnlineUsers(data)
    })

    socket.on("receiveMessage", (data) => {
      if (
        data.senderId === receiver._id ||
        data.receiverId === receiver._id
      ) {
        setMessages(prev => [...prev, data])
      }
    })

    socket.on("showTyping", (data) => {
      if (data.senderId === receiver._id) {
        setTypingUser("Typing...")
        setTimeout(() => setTypingUser(""), 2000)
      }
    })

    return () => {
      socket.off("receiveMessage")
      socket.off("showTyping")
      socket.off("onlineUsers")
    }

  }, [receiver])

  const loadMessages = async () => {
    const res = await getMessages(senderId, receiver._id)
    setMessages(res.data)
  }

  const handleSend = async () => {
    if (!message.trim()) return

    const msgData = {
      senderId,
      receiverId: receiver._id,
      message
    }

    await sendMessage(msgData)
    socket.emit("sendMessage", msgData)

    setMessage("")
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("senderId", senderId)
    formData.append("receiverId", receiver._id)

    await sendFile(formData)
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)

    mediaRecorderRef.current = recorder
    recorder.start()
    setRecording(true)

    const chunks = []

    recorder.ondataavailable = (e) => chunks.push(e.data)

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" })

      const formData = new FormData()
      formData.append("file", blob, "voice.webm")
      formData.append("senderId", senderId)
      formData.append("receiverId", receiver._id)

      await sendFile(formData)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current.stop()
    setRecording(false)
  }

  return (
    <div className="chatbox">

      <div className="chat-header">
        <span onClick={openProfile} style={{ cursor: "pointer" }}>
          {receiver.name}
        </span>

        <div style={{ fontSize: "12px", color: "#aaa" }}>
          {onlineUsers.includes(receiver._id) ? "Online 🟢" : "Offline ⚫"}
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "gray", paddingLeft: "10px" }}>
        {typingUser}
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.senderId === senderId ? "msg sent" : "msg received"}>

            {msg.message && <div>{msg.message}</div>}

            {msg.image && (
              <img
                src={`http://localhost:5000/upload/${msg.image}`}
                style={{ width: "150px", cursor: "pointer" }}
                onClick={() => setPreviewImage(`http://localhost:5000/upload/${msg.image}`)}
              />
            )}

            {msg.audio && (
              <audio controls src={`http://localhost:5000/upload/${msg.audio}`} />
            )}

            <div style={{ fontSize: "10px", opacity: "0.6" }}>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}

              {msg.senderId === senderId && (
                <span style={{ marginLeft: "5px" }}>
                  {msg.seen ? "✔✔" : "✔"}
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      <div className="input-area">

        <label className="file-btn">
          📎
          <input type="file" onChange={handleFile} />
        </label>

        <button onClick={() => setShowEmoji(prev => !prev)}>😊</button>

        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)

            socket.emit("typing", {
              senderId,
              receiverId: receiver._id
            })
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend()
          }}
          placeholder="Type message..."
        />

        <button onClick={handleSend}>➤</button>

        {!recording ? (
          <button onClick={startRecording}>🎤</button>
        ) : (
          <button onClick={stopRecording}>⏹</button>
        )}

      </div>

      {showEmoji && (
        <div style={{ position: "absolute", bottom: "70px" }}>
          <EmojiPicker onEmojiClick={(e) => setMessage(prev => prev + e.emoji)} />
        </div>
      )}

      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} className="preview-img" onClick={(e) => e.stopPropagation()} />
          <span className="close-preview" onClick={() => setPreviewImage(null)}>✖</span>
        </div>
      )}

    </div>
  )
}

export default Chatbox
import { useState, useEffect, useRef } from "react"
import { sendMessage, getMessages, sendFile } from "../services/api"
import "../styles/ChatBox.css"

function Chatbox({ receiver, setReceiver, openProfile }) {

  if (!receiver) {
    return <div className="empty">Select user</div>
  }

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [recording, setRecording] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const mediaRecorderRef = useRef(null)

  const senderId = localStorage.getItem("userId")

  useEffect(() => {
    if (receiver) {
      loadMessages()
    }
  }, [receiver])

  const loadMessages = async () => {
    try {
      const res = await getMessages(senderId, receiver._id)
      setMessages(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSend = async () => {
    if (!message.trim()) return

    const msgData = {
      senderId,
      receiverId: receiver._id,
      message
    }

    try {
      await sendMessage(msgData)
      loadMessages()
      setMessage("")
    } catch (err) {
      console.log(err)
    }
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("senderId", senderId)
    formData.append("receiverId", receiver._id)

    try {
      await sendFile(formData)
      loadMessages()
    } catch (err) {
      console.log(err)
    }
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)

    mediaRecorderRef.current = recorder
    recorder.start()
    setRecording(true)

    const chunks = []

    recorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" })

      const formData = new FormData()
      formData.append("file", blob, "voice.webm")
      formData.append("senderId", senderId)
      formData.append("receiverId", receiver._id)

      try {
        await sendFile(formData)
        loadMessages()
      } catch (err) {
        console.log(err)
      }
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
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.senderId === senderId
                ? "msg sent"
                : "msg received"
            }
          >

            {msg.message && <div>{msg.message}</div>}

            {msg.image && (
              <img 
                src={`http://localhost:5000/upload/${msg.image}`} 
                alt=""
                style={{ width: "150px", marginTop: "5px", cursor: "pointer" }}
                onClick={() => setPreviewImage(`http://localhost:5000/upload/${msg.image}`)}
              />
            )}

            {msg.file && (
              <a 
                href={`http://localhost:5000/upload/${msg.file}`} 
                target="_blank" 
                rel="noreferrer"
              >
                📄 Download File
              </a>
            )}

            {msg.audio && (
              <audio controls src={`http://localhost:5000/upload/${msg.audio}`} />
            )}

            <div style={{
              fontSize: "10px",
              marginTop: "4px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "5px",
              opacity: 0.7
            }}>
              <span>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>

              {msg.senderId === senderId && (
                <span>
                  {msg.seen ? "✔✔" : "✔"}
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      <div className="input-area">

        <input type="file" onChange={handleFile} />

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />

        <button onClick={handleSend}>Send</button>

        {!recording ? (
          <button onClick={startRecording}>🎤</button>
        ) : (
          <button onClick={stopRecording}>⏹</button>
        )}

      </div>

      {previewImage && (
        <div 
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            className="preview-img"
            onClick={(e) => e.stopPropagation()}
          />
          <span 
            className="close-preview"
            onClick={() => setPreviewImage(null)}
          >
            ✖
          </span>
        </div>
      )}

    </div>
  )
}

export default Chatbox
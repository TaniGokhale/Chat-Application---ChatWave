import axios from "axios"

const API = axios.create({
baseURL:"http://localhost:5000/api"
})

export const sendMessage = (data)=>{
return API.post("/messages/send",data)
}

export const getMessages = (senderId,receiverId)=>{
return API.get(`/messages/${senderId}/${receiverId}`)
}

export const getUsers = ()=>{
return API.get("/users")
}
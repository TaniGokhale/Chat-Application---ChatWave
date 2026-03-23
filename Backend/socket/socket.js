const { Server } = require("socket.io");

let onlineUsers = {}

const setupSocket = (server) => {

const io = new Server(server,{
cors:{origin:"*"}
})

io.on("connection",(socket)=>{

socket.on("join",(userId)=>{
  onlineUsers[userId] = socket.id
  io.emit("onlineUsers", Object.keys(onlineUsers))
})

socket.on("typing",(data)=>{
  socket.broadcast.emit("showTyping",data)
})

socket.on("disconnect",()=>{
  for(let userId in onlineUsers){
    if(onlineUsers[userId] === socket.id){
      delete onlineUsers[userId]
    }
  }
  io.emit("onlineUsers", Object.keys(onlineUsers))
})

})

return io
}

module.exports = setupSocket
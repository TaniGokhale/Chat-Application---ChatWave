const Message = require("../models/Message")

exports.sendMessage = async (req,res)=>{
try{

const { senderId, receiverId, message } = req.body

const newMessage = new Message({
senderId,
receiverId,
message
})

await newMessage.save()

req.io.emit("receiveMessage", newMessage)

res.json(newMessage)

}catch(error){
console.log(error)
res.status(500).json({error:"Server error"})
}
}

exports.sendFile = async (req,res)=>{
try{

const { senderId, receiverId } = req.body

let newMessageData = {
  senderId,
  receiverId
}

if(req.file.mimetype.startsWith("image")){
  newMessageData.image = req.file.filename
}
else if(req.file.mimetype.startsWith("audio")){
  newMessageData.audio = req.file.filename
}
else{
  newMessageData.file = req.file.filename
}

const newMessage = new Message(newMessageData)

await newMessage.save()

req.io.emit("receiveMessage", newMessage)

res.json(newMessage)

}catch(error){
console.log(error)
res.status(500).json({error:"Server error"})
}
}

exports.getMessages = async (req,res)=>{
try{

const { senderId, receiverId } = req.params

await Message.updateMany(
  { senderId: receiverId, receiverId: senderId, seen: false },
  { seen: true }
)

const messages = await Message.find({
$or:[
{senderId,receiverId},
{senderId:receiverId,receiverId:senderId}
]
}).sort({createdAt:1})  

res.json(messages)

}catch(error){
console.log(error)
res.status(500).json({error:"Server error"})
}
}
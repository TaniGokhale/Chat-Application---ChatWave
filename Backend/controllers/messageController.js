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

res.json(newMessage)

}catch(error){
console.log(error)
res.status(500).json({error:"Server error"})
}
}

exports.getMessages = async (req,res)=>{
try{

const { senderId, receiverId } = req.params

const messages = await Message.find({
$or:[
{senderId,receiverId},
{senderId:receiverId,receiverId:senderId}
]
})

res.json(messages)

}catch(error){
console.log(error)
res.status(500).json({error:"Server error"})
}
}
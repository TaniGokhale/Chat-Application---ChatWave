const Message = require("../models/Message")

exports.sendMessage = async(req,res)=>{

try{

const {senderId,receiverId,message} = req.body

if(!senderId || !receiverId || !message){
return res.status(400).json({error:"Missing fields"})
}

const newMessage = await Message.create({
senderId,
receiverId,
message
})

res.json(newMessage)

}catch(error){

console.log(error)

res.status(500).json({error:"Server error"})
}

}
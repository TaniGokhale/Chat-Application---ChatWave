const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  senderId:{
    type:String,
    required:true
  },
  receiverId:{
    type:String,
    required:true
  },
  message:{
    type:String,
    default:""
  },
  image: String,
  file: String,
  audio: String,
  seen: {
    type: Boolean,
    default: false
  }
},{timestamps:true})

module.exports = mongoose.model("Message",messageSchema)
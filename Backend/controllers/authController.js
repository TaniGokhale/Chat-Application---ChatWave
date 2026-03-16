const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// signup
exports.signup = async(req,res)=>{

try{

const {name,email,password} = req.body

const userExists = await User.findOne({email})

if(userExists){
return res.status(400).json({message:"User already exists"})
}

const hashedPassword = await bcrypt.hash(password,10)

const user = await User.create({
name,
email,
password:hashedPassword
})

res.json(user)

}catch(err){
res.status(500).json(err)
}

}

// login
exports.login = async(req,res)=>{

try{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.status(400).json({message:"User not found"})
}

const match = await bcrypt.compare(password,user.password)

if(!match){
return res.status(400).json({message:"Invalid password"})
}

const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

res.json({token,user})

}catch(err){
res.status(500).json(err)
}

}
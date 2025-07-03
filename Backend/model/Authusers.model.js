import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({

 name:{
     type:String,
     required:[true,"the name is required"]
 },
 email:{
     type:String,
     required:[true,"the email is requierd"],
     unique:true
 },
 password:{
     type:String,
     required:[true,'the password is required'],
     
 },
 role:{
    type:String,
    enum:['admin','CityShop','LocalShop'],
    required:true
 }

},{timestamps:true})
const AuthUser=new mongoose.model("User",UserSchema)
export default AuthUser;
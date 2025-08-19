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
 },
 profilePic:{
    type:String,
    default:""
 },
 address:{
    type:String,
    default:""
 },
 phone:{
    type:String,
    default:""
 },
 companyName:{
    type:String,
    default:""
 },
 companyWebsite:{
    type:String,
    default:"" 
 },
 businessRegistrationNO:{
    type:String,
    default:"" 
 },
 TaskLicence:{
    type:String,
    default:"" 
 },
 NationalId:{
    type:String,
    default:""
 }
 


},{timestamps:true})
const AuthUser=  mongoose.model("User",UserSchema)
export default AuthUser;
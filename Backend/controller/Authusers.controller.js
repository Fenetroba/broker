import express from "express";
import AuthUser from "../model/Authusers.model.js";
import bcrypt from 'bcrypt'

export const Register=async(req,res)=>{
    const {name,email,password,role}=req.body;
    try {
       const UserExist=await AuthUser.findOne({email})
       if(UserExist){
         return res.status(400).json({success:false, message:"the Email is alrady exist"})

       }
        if(!name || !email || !password || !role){
         return res.status(400).json({success:false, message:"the all are required"})
        } 
        if(password.length<6){
           return res.status(400).json({success:false, message:"the password length have be greter than 6"})

        }
        const HashPassword=await bcrypt.hash(password,10)
        const user = await AuthUser.create({ name, email, password:HashPassword,role });
        res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
     } catch (error) {
          res.status(500).json({error, message:"the error create on registration"})
          console.log(error)}
 }
 export const Login= async(req ,res)=>{
    const {email,password}=req.body
try {
    const user=await AuthUser.findOne({email})
   

    if (!user) {
        return res.status(400).json({sccess:true,message:"Incorrect Passwork or Email"})

      } 
    const isMatch = await bcrypt.compare(password ,user.password);
    if(user && isMatch){
        return res.status(200).json({sccess:true,message:"Login Sccessfull"})
    }
} catch (error) {
    console.log(error)
    return res.status(500).json({sccess:false,message:"Error occer on Login controllrer"})
}

}
import express from 'express'
import env from 'dotenv'
import {DBconnect} from './Db/DB.js'
env.config()
const app=express()
const PORT=process.env.PORT || 5000




app.listen(PORT,()=>{
     console.log("the server connect with port ",PORT)
     DBconnect();
})
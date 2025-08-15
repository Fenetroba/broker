import express from 'express'
import env from 'dotenv'
env.config()
import {DBconnect} from './Db/DB.js'
import Authroute from './Router/Authusers.router.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Chatrouter from './Router/Message.router.js'
const app=express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true,
}))
const PORT=process.env.PORT || 5000
app.use('/api/auth',Authroute)
app.use('/api/chat',Chatrouter)
app.listen(PORT,()=>{
     console.log("the server connect with port ",PORT)
     DBconnect();

})

import express from 'express'
import env from 'dotenv'
import {DBconnect} from './Db/DB.js'
import Authroute from './Router/Authusers.router.js'
env.config()
const app=express()
app.use(express.json());
const PORT=process.env.PORT || 5000
app.use('/api/auth',Authroute)
app.listen(PORT,()=>{
     console.log("the server connect with port ",PORT)
     DBconnect();
})

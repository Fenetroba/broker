import express from 'express'
import "dotenv/config";
import {DBconnect} from './Db/DB.js'
import Authroute from './Router/Authusers.router.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Chatrouter from './Router/Message.router.js'
import Telegramrouter from './Router/Telegram.js'
import Productrouter from './Router/Product.router.js'
import ProductRatingRouter from './Router/product.rating.router.js'
import UsersRouter from './Router/Users.router.js'
import { app, HttpServer } from './Db/socket.io.js';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true,
}))
const PORT=process.env.PORT || 5000
app.use('/api/auth', Authroute)
app.use('/api/chat', Chatrouter)
app.use('/telegram', Telegramrouter)
app.use('/api/product', Productrouter)
app.use('/api/product', ProductRatingRouter)
app.use('/api/users', UsersRouter)
HttpServer.listen(PORT,()=>{
     console.log("the server connect with port ",PORT)
     DBconnect();

})
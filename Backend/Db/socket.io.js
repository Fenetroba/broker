import {Server} from 'socket.io';
import http from 'http'
import express from 'express'


const app=express();

const HttpServer=http.createServer(app);

const io=new Server(HttpServer,{
     cors:{
          origin:["http://localhost:5173"],
     }
})

io.on('connection',(Socket)=>{
console.log("user is connected",Socket.id)

// Client should emit 'join' with their userId to join a personal room
Socket.on('join',(userId)=>{
     try{
          if(userId){
               Socket.join(String(userId))
               console.log(`Socket ${Socket.id} joined room ${userId}`)
          }
     }catch(err){
          console.error('Error joining room:', err)
     }
})

Socket.on('disconnect',()=>{
     console.log("user is disconnected",Socket.id)
})
})
export {io,app,HttpServer}
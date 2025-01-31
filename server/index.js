import express from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
const app=express()
const httpServer=createServer(app)
const io=new Server(httpServer,{
    cors:'*'
})
const emailToSocketId=new Map();
const socketIdtoEmail=new Map();
io.on('connection',(socket)=>{
socket.on('join room',(data)=>{
   const {roomId,email}=data
   emailToSocketId.set(email,socket.id)
socketIdtoEmail.set(socket.id,email)
io.to(roomId).emit('user joined',{email,id:socket.id})
    socket.join(roomId)
    io.to(socket.id).emit('join room',data)

  
})
socket.on('call user',({to,offer})=>{
io.to(to).emit('incoming call',{from:socket.id,offer})
})
socket.on('call accepted',({to,ans})=>{
io.to(to).emit('call accepted',{from:socket.id,ans})
})

socket.on('negotiation needed',({to,offer})=>{
    io.to(to).emit('negotiation needed',{from:socket.id,offer})
})
socket.on('negotiation done',({to,ans})=>{
    io.to(to).emit('negotiation final',{from:socket.id,ans})

})
})


io.listen(4000)
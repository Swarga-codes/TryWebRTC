import express from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
const app=express()
const httpServer=createServer(app)
const io=new Server(httpServer,{
    cors:'*'
})

io.on('connection',(socket)=>{
socket.on('join room',(roomId)=>{
   
    socket.join(roomId)
    io.to(roomId).emit('user joined',socket.id)

    socket.on('message',(message)=>{
        socket.to(roomId).emit('message',message)
        })
})

})


io.listen(4000)
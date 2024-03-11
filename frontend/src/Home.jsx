
import {useContext, useEffect, useState} from 'react'
import './App.css'
import { SocketContext } from './SocketContextApi'
import {useNavigate} from 'react-router-dom'
function Home() {
    let socket=useContext(SocketContext)
    const navigate=useNavigate()
    const[roomId,setRoomId]=useState('')

 function joinRoom(){
    if(roomId){
    socket.emit('join room',roomId)
    navigate(`/room/${roomId}`)
    }
 }

  return (
    <>
  <input type="text" placeholder='enter room id' value={roomId} onChange={(e)=>setRoomId(e.target.value)}/>
  <button onClick={joinRoom}>Join Room</button>
    </>
  )
}

export default Home

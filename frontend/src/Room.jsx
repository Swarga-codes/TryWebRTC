import {useCallback, useContext, useEffect, useState} from 'react'
import { SocketContext } from './SocketContextApi'
import {useParams} from 'react-router-dom'
import ReactPlayer from 'react-player'
function Room() {
    const {roomId}=useParams()
   
    const [remoteSocketId,setRemoteSocketId]=useState(null)
    const [myStream,setMyStream]=useState()
    let socket=useContext(SocketContext)
    const handleUserJoined=useCallback(({email,id})=>{
      setRemoteSocketId(id)
    },[])
    const handleCallUser=useCallback(async()=>{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true})
      setMyStream(stream)
    },[])
    useEffect(()=>{
        socket.on('user joined', handleUserJoined);
        return()=>{
        socket.off('user joined',handleUserJoined)
        }
      },[socket,handleUserJoined])
     
  return (
    <div>
   <h1>Room: {roomId} </h1>
   <p>{remoteSocketId?'connected':'No one in the room'}</p>
   {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
  {myStream && <ReactPlayer url={myStream}  muted playing width={300} height={300}/>}
    <ul>
     
    </ul>
   </div>
  )
}

export default Room
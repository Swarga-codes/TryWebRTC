import {useCallback, useContext, useEffect, useState} from 'react'
import { SocketContext } from './SocketContextApi'
import {useParams} from 'react-router-dom'
import ReactPlayer from 'react-player'
import peer from './peer'
function Room() {
    const {roomId}=useParams()
   
    const [remoteSocketId,setRemoteSocketId]=useState(null)
    const [myStream,setMyStream]=useState()
    const [remoteStream,setRemoteStream]=useState()
    let socket=useContext(SocketContext)
    const handleUserJoined=useCallback(({email,id})=>{
      setRemoteSocketId(id)
    },[])
    const handleCallUser=useCallback(async()=>{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true})
      const offer=await peer.getOffer()
      socket.emit('call user',{to:remoteSocketId,offer})
      setMyStream(stream)
    },[remoteSocketId,socket])
    const handleIncomingCall=useCallback(async({from,offer})=>{
      console.log(from,offer)
      setRemoteSocketId(from)
      const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true})
      setMyStream(stream)
      const ans=await peer.getAnswer(offer)
      socket.emit('call accepted',{to:from,ans})
    },[socket])
    const handleCallAccepted=useCallback(async({from,ans})=>{
console.log(from,ans)
peer.setLocalDescription(ans)
console.log('Accepted!')
for(const track of myStream.getTracks()){
  peer.peer.addTrack(track,myStream);
}
    },[myStream])

    useEffect(()=>{
      peer.peer.addEventListener('track',(e)=>{
        const remoteStream=e.streams
        setRemoteStream(remoteStream)
      })
    },[])
    useEffect(()=>{
        socket.on('user joined', handleUserJoined);
        socket.on('incoming call',handleIncomingCall)
        socket.on('call accepted',handleCallAccepted)
        return()=>{
        socket.off('user joined',handleUserJoined)
        socket.off('incoming call',handleIncomingCall)
        socket.off('call accepted',handleCallAccepted)


        }
      },[socket, handleUserJoined, handleIncomingCall, handleCallAccepted])
     
  return (
    <div>
   <h1>Room: {roomId} </h1>
   <p>{remoteSocketId?'connected':'No one in the room'}</p>
   {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
  {myStream && <>
  <h1>My Stream</h1>
  <ReactPlayer url={myStream}  muted playing width={300} height={300}/></>}
  {remoteStream && <>
  <h1>Remote Stream</h1>
  <ReactPlayer url={remoteStream}  muted playing width={300} height={300}/></>}
    <ul>
     
    </ul>
   </div>
  )
}

export default Room
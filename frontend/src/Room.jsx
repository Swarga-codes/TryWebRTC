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
    const sendStreams=useCallback(()=>{
      for(const track of myStream.getTracks()){
        peer.peer.addTrack(track,myStream);
      }
    },[myStream])
    const handleCallAccepted=useCallback(async({from,ans})=>{
console.log(from,ans)
peer.setLocalDescription(ans)
console.log('Accepted!')
sendStreams()
    },[sendStreams])

const handleNegotitation=useCallback(async()=>{
const offer=await peer.getOffer()
socket.emit('negotitation needed',{offer,to:remoteSocketId})
},[remoteSocketId,socket])

useEffect(()=>{
peer.peer.addEventListener('negotiationneeded',handleNegotitation)
return()=>{
  peer.peer.removeEventListener('negotiationneeded',handleNegotitation)
}
},[handleNegotitation])

    useEffect(()=>{
      peer.peer.addEventListener('track',(e)=>{
        const remoteStream=e.streams
        setRemoteStream(remoteStream[0])
      })
    },[])

    const handleIncomingNegotiation=useCallback(async({from,offer})=>{
const ans=await peer.getAnswer(offer)
socket.emit('negotiation done',{to:from,ans})
    },[socket])
    const handleNegotitationFinal=useCallback(async({ans})=>{
await peer.setLocalDescription(ans)
    },[])
    useEffect(()=>{
        socket.on('user joined', handleUserJoined);
        socket.on('incoming call',handleIncomingCall)
        socket.on('call accepted',handleCallAccepted)
        socket.on('negotiation needed',handleIncomingNegotiation)
        socket.on('negotiation final',handleNegotitationFinal)
        return()=>{
        socket.off('user joined',handleUserJoined)
        socket.off('incoming call',handleIncomingCall)
        socket.off('call accepted',handleCallAccepted)
        socket.off('negotiation needed',handleIncomingNegotiation)
        socket.off('negotiation final',handleNegotitationFinal)  

        }
      },[socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleIncomingNegotiation, handleNegotitationFinal])
     
  return (
    <div className='text-white p-10'>
   <h1 className='text-2xl font-bold'>Room: {roomId} </h1>
   <p className='mt-10 text-lg'>{remoteSocketId?'connected':'No one in the room'}</p>
   <div className='mt-5'>
   {myStream && <button className='p-2 bg-violet-600 rounded-md' onClick={sendStreams}>Send Stream</button>}
   {remoteSocketId && <button className='p-2 bg-green-600 rounded-md ml-5' onClick={handleCallUser}>Call</button>}
   </div>
   <div className='flex mt-10 justify-between items-center'>
  {myStream && <div>
  <h1 className='font-bold text-center text-3xl'>Me</h1>
  <ReactPlayer url={myStream}  muted playing width={500} height={400}/></div>}
  {remoteStream && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="green" className="w-16 h-16">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
</svg>
}
  {remoteStream && <div>
  <h1 className='font-bold text-center text-3xl'>Friend</h1>
  <ReactPlayer url={remoteStream}  muted playing width={500} height={400}/></div>}
  </div>
  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg> */}

   </div>
  )
}

export default Room
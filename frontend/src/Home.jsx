
import {useContext, useState} from 'react'
import './App.css'
import { SocketContext } from './SocketContextApi'
import {useNavigate} from 'react-router-dom'
function Home() {
    let socket=useContext(SocketContext)
    const navigate=useNavigate()
    const [email,setEmail]=useState('')
    const[roomId,setRoomId]=useState('')

 function joinRoom(){
    if(roomId){
    socket.emit('join room',{roomId,email})
    navigate(`/room/${roomId}`)
    }
 }

  return (
    <>
 <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-16 h-16 m-auto">
  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>

    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Join the Video Call</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-6" onSubmit={(e)=>{
      e.preventDefault()
      joinRoom()
    }}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email address</label>
        <div className="mt-2">
          <input id="email" name="email" type="email" autoComplete="email" value={email} placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} required className="block w-full p-2 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="room" className="block text-sm font-medium leading-6 text-white">Room ID</label>
          
        </div>
        <div className="mt-2">
          <input id="room" name="room" type="text" autoComplete="current-room" placeholder='Enter room ID' value={roomId} onChange={(e)=>setRoomId(e.target.value)} required className="block w-full p-2 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Join Room</button>
      </div>
    </form>

  
  </div>
</div>
    </>
  )
}

export default Home

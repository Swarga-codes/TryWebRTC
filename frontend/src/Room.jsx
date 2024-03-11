import {useContext, useEffect, useState} from 'react'
import { SocketContext } from './SocketContextApi'
import {io} from 'socket.io-client'
import {useParams} from 'react-router-dom'
function Room() {
    const {roomId}=useParams()
    const [input,setInput]=useState('')
    const [messages,setMessages]=useState([])
    let socket=useContext(SocketContext)
    useEffect(()=>{
        socket.on('user joined', (userId) => {
            setMessages(prevMessages => [...prevMessages, `User joined: ${userId}`]);
        });
        socket.on('message',message=>{
            setMessages(prevMessages => [...prevMessages, message]);

        })
      },[])
      function sendMessages(){
        setMessages([...messages,input])
        socket.emit('message',input)
         setInput('')
      }
  return (
    <div>
    <input type="text" value={input} onChange={(e)=>{
      setInput(e.target.value)
    }}/>
    <button onClick={sendMessages}>Send Message</button>
    <ul>
      {
        messages.map((message,idx)=>(
          <li key={idx}>{message}</li>
        ))
      }
    </ul>
   </div>
  )
}

export default Room
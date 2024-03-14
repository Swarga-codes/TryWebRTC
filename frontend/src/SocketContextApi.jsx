import { createContext } from "react";
import {io} from 'socket.io-client'

export const SocketContext=createContext(null)

export const SocketContextProvider=(props)=>{
    var socket=io('https://trywebrtc.onrender.com');
    return (<SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>)
}
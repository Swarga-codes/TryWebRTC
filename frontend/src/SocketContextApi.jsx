import { createContext } from "react";
import {io} from 'socket.io-client'

export const SocketContext=createContext(null)

export const SocketContextProvider=(props)=>{
    var socket=io('http://localhost:4000');
    return (<SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>)
}
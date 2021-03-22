  
import React from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

const SocketProvider = ({ children }) => {
    var ENDPOINT = "";
    if(!process.env.NODE_ENV || process.env.NODE_ENV === "development"){
        ENDPOINT = "http://localhost";
    } else {
        ENDPOINT = 'https://socket-chat-ak.herokuapp.com/';
    }
    const socket = io(ENDPOINT, { transports: ['websocket', 'polling'] })
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }
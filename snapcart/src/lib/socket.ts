import { io, Socket } from "socket.io-client"

let socket : Socket | null = null

export const getSocket = () => {
    if(!socket){
        console.log("🔌 Initializing Socket Connection...")
        socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER,{ 
            transports: ["websocket"] 
        })
    }
    return socket
}
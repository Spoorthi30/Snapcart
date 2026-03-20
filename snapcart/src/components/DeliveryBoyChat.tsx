/* eslint-disable */

'use client'

import { getSocket } from "@/lib/socket"
import { IMessage } from "@/models.ts/message.model" // Ensure this path is correct
import axios from "axios"
import { Loader, Send, Sparkle } from "lucide-react"
import mongoose from "mongoose"
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useRef } from "react"

type props = {
    orderId: mongoose.Types.ObjectId,
    deliveryBoyId: mongoose.Types.ObjectId,
}

const DeliveryBoyChat = ({ orderId, deliveryBoyId }: props) => {

    const [newMessages, setNewMessages] = useState('')
    const [messages, setMessages] = useState<IMessage[]>([]) 
    const scrollRef = useRef<HTMLDivElement>(null);
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        const socket = getSocket()
        socket.emit("join-room",orderId)

        socket.on('send-message',(message)=>{
            setMessages((prev) => {
            const exists = prev.find(m => m._id === message._id || (m.text === message.text && m.time === message.time));
            if (exists) return prev;
            return [...prev, message];
        });
        })

        return () => {
            socket.off("send-message")
        }
    },[])

    const sendMsg = async () => {
        if (!newMessages.trim()) return;

        const socket = getSocket()

        const messageData = {
            roomId: orderId,
            text: newMessages,
            senderId: deliveryBoyId,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        }

        socket.emit("send-message", messageData)
        setNewMessages('')
    }

    useEffect(() => {
        const socket = getSocket()  
        const handleIncomingMessage = (message: any) => {
            console.log("Received socket message:", message);
            // We verify the room ID to be safe
            if (message.roomId === orderId || message.roomId === orderId.toString()) {
                setMessages((prev) => [...prev, message])
            }
        }

        socket.on("send-message", handleIncomingMessage)

        const getAllMessage = async () => {
            try {
                const result = await axios.post("/api/chat/message", { roomId: orderId })
                // console.log("Fetched history:", result.data)
                
                // if (Array.isArray(result.data)) {
                    setMessages(result.data)
                // }
            } catch (error) {
                console.log("Error fetching messages:", error)
            }
        }
        getAllMessage()

        return () => {
            socket.off("send-message", handleIncomingMessage)
        }
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getSuggestions = async() => {
        setLoading(true)
        try {
            const lastMessage = messages?.filter(m=>m.senderId!==deliveryBoyId)?.at(-1)
            const result = await axios.post('/api/chat/ai-suggestions',{message:lastMessage?.text,role:"deliveryBoy"})
            setSuggestions(result.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col border rounded-3xl shadow-lg p-4 h-[430px] bg-white">

            <div className="flex justify-between mb-3 items-center">
                <span className="font-semibold text-sm text-gray-700">Quick response</span>
                <motion.button
                disabled={loading}
                onClick={getSuggestions}
                whileTap={{scale : 0.9}}
                className="px-3 py-1 text-sm flex ietm-text-center gap-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200 shadow-sm"
                ><Sparkle size={14}/>{loading ? <Loader className="w-5 h-5 animate-spin"/> : "AI Suggestion"}</motion.button>
            </div>

            <div className="flex gap-2 flex-wrap mb-3">
                {suggestions.map((s,i)=>(
                    <motion.div key={i}
                    whileTap={{scale:0.92}}
                    className="px-3 p-1 text-sm bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer"
                    onClick={()=>setNewMessages(s)}
                    >
                        {s}
                    </motion.div>
                ))}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.senderId == deliveryBoyId ? 'justify-end ' : 'justify-start'}`}
                        >
                            <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                                ${msg.senderId == deliveryBoyId
                                    ? "bg-green-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }
                            `}>
                                <p>{msg.text}</p>
                                <p className={`text-[10px] opacity-70 mt-1 text-right ${msg.senderId == deliveryBoyId ? 'text-gray-200' : 'text-gray-500'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="bg-gray-100 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 rounded-xl flex-1 text-black"
                    value={newMessages}
                    onChange={(e) => setNewMessages(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                />
                <button className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white" onClick={sendMsg}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    )
}

export default DeliveryBoyChat
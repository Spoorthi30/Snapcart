/* eslint-disable */

"use client";

import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models.ts/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, Loader, Send, Sparkle } from "lucide-react";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from 'motion/react'
import { IMessage } from "@/models.ts/message.model";

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: string;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    name: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out for delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

const TrackOrder = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<IOrder>();
  const router = useRouter();
  const [newMessages, setNewMessages] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [userLocation, setUserLocation] = useState<ILocation>({
    longitude: 0,
    latitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    longitude: 0,
    latitude: 0,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(
          `/api/user/get-order-for-tracking/${orderId}`,
        );
        console.log(result.data);
        setOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });
        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
        });
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", (data) => {
      setDeliveryBoyLocation({
        latitude: data.location.coordinates[1] ?? data.location.latitude,
        longitude: data.location.coordinates[0] ?? data.location.longitude,
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, [order]);


  useEffect(()=>{
        const socket = getSocket()
        socket.emit("join-room",orderId)

        socket.on('send-message',(message)=>{
            if(message.roomId === orderId){
                setMessages((prev)=>[...prev,message])
            }
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
            senderId: userData?._id,
            // Ensure time format matches what your backend/DB expects
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        }

        socket.emit("send-message", messageData)
        setNewMessages('')
    }

  useEffect(() => {
      
          const getAllMessage = async () => {
              try {
                  const result = await axios.post("/api/chat/message", { roomId: orderId })
                  console.log(result.data)
                  setMessages(result.data)
              } catch (error) {
                  console.log("Error fetching messages:", error)
              }
          }
          getAllMessage()          
      }, [])

      useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages]);

  const getSuggestions = async() => {
          setLoading(true)
          try {
              const lastMessage = messages?.filter(m=>m.senderId!==userData?._id)?.at(-1)
              const result = await axios.post('/api/chat/ai-suggestions',{message:lastMessage?.text,role:"user"})
              setSuggestions(result.data)
              setLoading(false)
          } catch (error) {
              console.log(error)
              setLoading(false)
          }
      }


  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999">
          <button
            className="p-2 rounded-full bg-green-100"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </button>
          <div>
            <h2 className="text-xl font-bold">Track Order</h2>
            <p className="text-sm test-gray-600">
              order#{order?._id.toString().slice(-6)}{" "}
              <span className="text-green-600 font-semibold">
                {order?.status}{" "}
              </span>
            </p>
          </div>
        </div>
        <div className="px-4 mt-6">
          <div className="rounded-3xl shadow overflow-hidden border">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          <div className="flex flex-col border mt-4 rounded-3xl shadow-lg p-4 h-[430px] bg-white">

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
                    // Use index as fallback if _id is missing temporarily
                    key={msg._id?.toString() || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderId == userData?._id ? "justify-end " : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                                ${
                                  msg.senderId == userData?._id
                                    ? "bg-green-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }
                            `}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-[10px] opacity-70 mt-1 text-right ${msg.senderId == userData?._id ? "text-gray-200" : "text-gray-500"}`}
                      >
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
              <button
                className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"
                onClick={sendMsg}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

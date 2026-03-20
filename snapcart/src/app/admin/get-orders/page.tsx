/* eslint-disable */

'use client'

import axios from 'axios'
import { ArrowLeft, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import AdminOrderComponent from '@/components/AdminOrderComponent'
import { getSocket } from '@/lib/socket'
import mongoose from 'mongoose'
import { IUser } from '@/models.ts/user.model'

export interface IOrder{
    _id : mongoose.Types.ObjectId
    user : mongoose.Types.ObjectId
    items : [
        {
            grocery : mongoose.Types.ObjectId
            name : string
            price : string
            unit : string
            image : string
            quantity : string
        }
    ]
    isPaid : boolean
    totalAmount : number
    paymentMethod : "cod" | "online"
    address : {
        name : string
        mobile : string
        city : string
        state : string
        pincode : string
        fullAddress : string
        latitude : number
        longitude:number
    }
    assignment?: mongoose.Types.ObjectId
    assignedDeliveryBoy? : IUser   
    status : "pending" | "out for delivery" | "delivered"
    createdAt? :Date
    updatedAt? :Date
}

const GetOrders = () => {

    const [orders, setOrders] = useState<IOrder[]>()
    const router = useRouter()
    
    useEffect(() =>{
        const getOrders = async() => {
            try {
                const result = await axios.get('/api/admin/get-orders')
                setOrders(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getOrders()
    },[])

    useEffect(():any=>{
        const socket = getSocket()
        socket.on("new-order",(newOrder)=>{
            console.log("New Order via Socket:", newOrder);
            setOrders(prev=>{
                if(!prev) return [newOrder]
                return [newOrder,...prev!]
            })
        })

        // socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
        //     setOrders((prev)=>prev?.map((order)=>(
        //         order._id==orderId?{...order,assignedDeliveryBoy}:order
        //     )))
        // })

        socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
            setOrders((prev)=>prev?.map((order)=>(
                order._id.toString()==orderId.toString()?{...order,assignedDeliveryBoy}:order
            )))
        })

        return() => {
            socket.off("new-order")
            socket.off("order-assigned")
        }
    },[])

    useEffect(():any => {
    const socket = getSocket();

    socket.on("order-status-update", (data) => {
        setOrders((prev) => 
            prev?.map((order) => 
                order._id.toString() === data.orderId.toString() 
                    ? { ...order, status: data.status, isPaid: data.isPaid } 
                    : order
            )
        );
    });

    return () => socket.off("order-status-update");
}, []);

  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen w-full'>
        <div className='max-w-3xl mx-auto px-4 pt-16 pb-10 relative'>
            <div className='fixed left-0 top-0 w-full backdrop-blur-lg shadow-sm bg-white/70 border-b z-50'>
                <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
                    <button onClick={() => router.push("/")} className='p-2 bg-gray-100 hover:bg-gray-200 active:scale-95 transition cursor-pointer rounded-full'>
                        <ArrowLeft size={20} className='text-green-800'/>
                    </button>
                    <h2 className='text-gray-800 font-bold text-xl'>Manage Orders</h2>
                </div>
            </div>
            {orders?.length === 0 
            ? <div className='flex items-center justify-center pt-20'>
                <div className='flex flex-col items-center justify-center gap-1'>
                    <Package size={56} className='text-green-800'/>
                    <h2 className='text-xl font-medium'>No orders founds</h2>
                    <p className='text-gray-500 text-sm'>Kindly wait until the user places an order</p>
                </div>
            </div>
            :
            <div className='mt-6 space-y-6'>
                    {orders?.map((order,index) => (
                        <motion.div
                        initial={{opacity:0 , y:20}}
                        animate={{ opacity:1 , y:0}}
                        transition={{duration:0.4}}
                        key={index}>
                            <AdminOrderComponent order={order}/>
                        </motion.div>
                    ))}
                </div>    
            }
                
        </div>
    </div>
  )
}

export default GetOrders
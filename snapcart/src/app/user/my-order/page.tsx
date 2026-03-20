'use client'

import axios from 'axios'
import { ArrowLeft, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import{ useEffect, useState } from 'react'
import { motion } from 'motion/react'
import UserOrderComponent from '@/components/UserOrderComponent'
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
    assignedDeliveryBoy? : IUser   //After creating DeliveryAssignment model
    status : "pending" | "out for delivery" | "delivered"
    createdAt? :Date
    updatedAt? :Date
    deliveryOtp : string
    deliveryOtpVerify : boolean
    deliveredAt : Date
}

const MyOrder = () => {

    const router = useRouter()
    const [orders, setOrders] = useState<IOrder[]>()

    useEffect(() => {
        const getMyOrders = async() => {
            try {
                const result = await axios.get('/api/user/my-order')
                setOrders(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMyOrders()
    },[])

    useEffect(()=>{
        const socket = getSocket()
        socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
            setOrders((prev)=>prev?.map((order)=>(
                order._id==orderId?{...order,assignedDeliveryBoy}:order
            )))
        })
        return ()=>{socket.off("order-assigned")}
    },[])

  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen w-full'>
        <div className='max-w-3xl mx-auto px-4 pt-16 pb-10 relative'>
            <div className='fixed left-0 top-0 w-full backdrop-blur-lg shadow-sm bg-white/70 border-b z-50'>
                <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
                    <button onClick={() => router.push("/")} className='p-2 bg-gray-100 hover:bg-gray-200 active:scale-95 transition cursor-pointer rounded-full'>
                        <ArrowLeft size={20} className='text-green-800'/>
                    </button>
                    <h2 className='text-gray-800 font-bold text-xl'>My Orders</h2>
                </div>
            </div>
            {orders?.length === 0 ?
                <div className='flex flex-col items-center justify-center pt-20'>
                    <Package size={70} className='text-green-700 mb-4'/>
                    <h2 className='text-gray-800 font-semibold text-xl'>No orders found</h2>
                    <p className='text-gray-500 text-sm mt-1'>Start shopping to find your orders here</p>
                </div>
            :
                <div className='mt-6 space-y-6'>
                    {orders?.map((order,index) => (
                        <motion.div
                        initial={{opacity:0 , y:20}}
                        animate={{ opacity:1 , y:0}}
                        transition={{duration:0.4}}
                        key={index}>
                            <UserOrderComponent order={order}/>
                        </motion.div>
                    ))}
                </div>    
            }
        </div>
    </div>
  )
}

export default MyOrder
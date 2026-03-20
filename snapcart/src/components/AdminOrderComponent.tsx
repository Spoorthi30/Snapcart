'use client'

import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User, UserCheck } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import mongoose from "mongoose";
import { IUser } from "@/models.ts/user.model";
import toast from "react-hot-toast";

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


const AdminOrderComponent = ({ order }: { order: IOrder }) => {

    const statusOption = ["pending","out for delivery"]
    const [expand, setExpand] = useState(false)
    const [status, setStatus] = useState<string>("pending")

    const getStatusColor = (status:string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-300"
            case "out for delivery":
                return "bg-blue-100 text-blue-700 border-blue-300"
            case "delivered":
                return "bg-green-100 text-green-700 border-green-300"
            default:
                return "bg-gray-100 text-gray-700 border-gray-300"
        }
    }

    const updateStatus = async(orderId:string,status:string) => {
      try {
        const result = await axios.post(`/api/admin/update-order-status/${orderId}`,{status})
        // console.log(result.data)
        setStatus(status)
        toast.success("Updated the status")
      } catch (error) {
        console.log(error)
        toast.error("Error while updating the status")
      }
    }

    useEffect(() => {
      setStatus(order.status)
    },[order])

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-all border border-gray-100 rounded-2xl p-5">
      <div className="py-5 flex flex-col md:flex-row md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-green-700 font-bold">
            <Package className="" size={18} />
            <h2 className="text-xl">Order #{order._id.toString().slice(-6)}</h2>
          </div>
          {status!="delivered" && 
            <span className={`w-fit inline-block px-2 py-1 rounded-full border font-semibold text-sm ${
              order.isPaid
                ? "border-green-300 text-green-700 bg-green-100"
                : "border-red-300 text-red-700 bg-red-100"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
          }
          <p className="text-gray-400 text-sm">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
          <div className="space-y-1 mt-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <User className="text-green-700" size={18}/>
              <span className="text-gray-800">{order.address.name}</span>
            </p>
            <p className="flex items-center gap-2 text-sm font-medium">
              <Phone className="text-green-700" size={18}/>
              <span className="text-gray-800">{order.address.mobile}</span>
            </p>
            <p className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="text-green-700" size={18}/>
              <span className="text-gray-800">{order.address.fullAddress}</span>
            </p>
          </div>
          <div className="mt-3">
                {order.paymentMethod === 'cod'
                ? <div className="flex items-center gap-1 text-sm">
                    <Truck className="text-green-600" size={16}/>
                    <span className="text-gray-700">Cash on Delivery</span>
                  </div>
                : <div className="flex items-center gap-1 text-sm">
                    <CreditCard className="text-green-600" size={16}/>
                    <span className="text-gray-700">Online Payment</span>
                  </div>
                }
            </div>

                {order.assignedDeliveryBoy && 
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <UserCheck className="text-blue-600" size={18}/>
                      <div className="font-semibold text-blue-800">
                        <p>Assigned to : {order.assignedDeliveryBoy.name}</p>
                        <p className="text-xs text-gray-600">📞 +91{order.assignedDeliveryBoy.mobile}</p>
                      </div>
                    </div>
                    <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Call</a>
                  </div>
                }

        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
            <span className={`px-3 py-1 border rounded-full font-semibold text-xs ${getStatusColor(status)}`}>
                {status}
            </span>
            {status!="delivered" && 
            <select className="border border-gray-100 text-sm focus:ring focus:ring-green-500 rounded-md px-3 py-1 shadow-md transition hover:border-green-400 outline-none" 
            value={status}
            onChange={(e)=>updateStatus(order._id?.toString(),e.target.value)}>
                {statusOption.map((option)=>(
                    <option key={option} value={option}>{option.toUpperCase()}</option>
                ))}
            </select>
            }
        </div>
      </div>
      <div className="border-t border-gray-400 py-5">
            <button onClick={()=>setExpand(!expand)} className="text-sm text-gray-800 hover:text-green-800 font-medium flex items-center w-full transition justify-between">
                <span className="flex items-center gap-1">
                    <Package size={16} className="text-green-600"/>
                    {expand ? "Hide order items" : `View ${order.items.length} Items`}
                </span>
                {expand ? <ChevronUp className="text-green-700" size={16}/> : <ChevronDown className="text-green-700" size={16}/>}
            </button>
            <motion.div
                initial={{height : 0 , opacity:0}}
                animate={{
                    height : expand ? "auto" : 0,
                    opacity : expand ? 1 : 0
                }}
                transition={{duration:0.3}}
                className="overflow-hidden"
                >
                    <div className="mt-3 space-y-3">
                        {order.items.map((item,index)=>(
                            <div key={index} className="bg-gray-50 hover:bg-gray-100 transition px-3 py-2 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image src={item.image} alt="image" width={48} height={48} className="rounded-lg border border-gray-200 object-cover"/>
                                    <div>
                                        <p className="text-sm text-gray-700 font-medium capitalize">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x {item.unit}</p>
                                    </div>
                                </div>
                                <p className="text-gray-800 font-semibold text-sm">₹{Number(item.price)*Number(item.quantity)}</p>
                            </div>
                        ))}
                    </div>
            </motion.div>
      </div>

      <div className="border-t border-gray-800 flex items-center justify-between py-2 font-semibold text-sm">
            <div className="flex items-center gap-2">
                <Truck className="text-green-700" size={18}/>
                <span>Delivery : <span className="text-green-800">{status}</span></span>
            </div>
            <div>
                Total : <span className="text-green-800">₹{order.totalAmount}</span>
            </div>
        </div>
    </div>
  );
};

export default AdminOrderComponent;

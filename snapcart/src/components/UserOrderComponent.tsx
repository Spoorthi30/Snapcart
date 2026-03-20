/* eslint-disable */

"use client";

import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { getSocket } from "@/lib/socket";
import mongoose from "mongoose";
import { IUser } from "@/models.ts/user.model";
import { useRouter } from "next/navigation";

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

const UserOrderComponent = ({ order }: { order: IOrder }) => {
  const [expand, setExpand] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [isPaid, setIsPaid] = useState(order.isPaid);

  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "out for delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // useEffect((): any => {
  //   const socket = getSocket();
    
  //   socket.on("order-status-update", (data) => {
  //     if (data.orderId.toString() === order._id.toString()) {
  //       setStatus(data.status);
  //     }
  //   });
  //   return () => socket.off("order-status-update");
  // }, []);

  useEffect((): any => {
    const socket = getSocket();

    socket.emit("join-room", order._id.toString());

    const handleStatusUpdate = (data: { orderId: string; status: string,isPaid : boolean }) => {
    if (data.orderId.toString() === order._id.toString()) {
      setStatus(data.status as any);
      setIsPaid(data.isPaid)
    }
  };
    
    socket.on("order-status-update", handleStatusUpdate);
    return () => socket.off("order-status-update",handleStatusUpdate);
  }, [order._id]);

  return (
    <div className="bg-white border border-gray-100 shadow-md hover:shadow-lg rounded-2xl transition-all duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-4 py-3 bg-linear-to-r from-gray-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            Order
            <span className=" ml-1 text-green-800 font-bold">
              #{order._id.toString().slice(-6)}
            </span>
          </h3>
          <p>{new Date(order.createdAt!).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {status !== "delivered" &&
            <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border 
                    ${
                      order.isPaid
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }
                    `}
            >
              {order.isPaid ? "Paid" : "Unpaid"}
            </span>
          }
          <span
            className={`px-3 py-1 rounded-full border font-semibold text-xs ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>
      
      <div className="p-5 space-y-5">
        {order.paymentMethod === "cod" ? (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16} className="text-green-600" />
            <span>Cash on Delivery</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <CreditCard size={16} className="text-green-600" />
            <span>Online Payment</span>
          </div>
        )}

        {order.assignedDeliveryBoy && status!="delivered" && (
          <>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                <UserCheck className="text-blue-600" size={18} />
                <div className="font-semibold text-blue-800">
                    <p>Assigned to : {order.assignedDeliveryBoy.name}</p>
                    <p className="text-xs text-gray-600">
                    📞 +91{order.assignedDeliveryBoy.mobile}
                    </p>
                </div>
                </div>
                <a
                href={`tel:${order.assignedDeliveryBoy.mobile}`}
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                Call
                </a>
            </div>

            <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 font-semibold  rounded-xl shadow-lg hover:bg-green-700 transition" onClick={()=>router.push(`/user/track-order/${order._id.toString()}`)}>
                Track Your Order
            </button>
        </>
        )}

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin className="text-green-600" size={18} />
          <span className="truncate">{order.address.fullAddress}</span>
        </div>

        <div className="border-t border-gray-300 pt-3">
          <button
            onClick={() => setExpand(!expand)}
            className="text-sm text-gray-800 hover:text-green-800 font-medium flex items-center w-full transition justify-between"
          >
            <span className="flex items-center gap-2">
              <Package size={16} className="text-green-700" />
              {expand ? "Hide Order Items" : `View ${order.items.length} Items`}
            </span>
            {expand ? (
              <ChevronUp className="text-green-700" size={16} />
            ) : (
              <ChevronDown className="text-green-700" size={16} />
            )}
          </button>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expand ? "auto" : 0,
              opacity: expand ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 transition px-3 py-2 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt="image"
                      width={48}
                      height={48}
                      className="rounded-lg border border-gray-200 object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-700 font-medium capitalize">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {item.unit}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm">
                    ₹{Number(item.price) * Number(item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 flex items-center justify-between pt-2 font-semibold text-sm">
          <div className="flex items-center gap-2">
            <Truck className="text-green-700" size={18} />
            <span>
              Delivery : <span className="text-green-800">{status}</span>
            </span>
          </div>
          <div>
            Total : <span className="text-green-800">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderComponent;

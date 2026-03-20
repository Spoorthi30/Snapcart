'use client'

import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/cartSlice"
import { RootState } from "@/redux/store"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"

export interface IGrocery{
    _id?:string,
    name : string,
    category : string,
    price : string,
    unit : string,
    image : string,
    createdAt?:Date,
    updatedAt?:Date
}
const GroceryItemCard = ({item}:{item : IGrocery}) => {
    const dispatch = useDispatch()
    const {cartData} = useSelector((state:RootState)=>state.cart)
    const cartItem = cartData.find(i=>i._id==item._id)
  return (
    <motion.div
    initial={{opacity:0,y:50,scale:0.9}}
    whileInView={{opacity:1,y:0,scale:1}}
    viewport={{once:false}}
    className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden border border-gray-100 rounded-2xl"
    >
        <div className="w-full relative overflow-hidden group aspect-4/3 bg-gray-50">
            <Image src={item.image} alt={item.name} fill sizes="(max-width:768px) 100vw , 25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-linear-to-b from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200"/>
        </div>
        <div className="flex flex-col p-4 ">
            <p className="text-xs font-medium text-gray-500 mb-1">{item.category}</p>
            <h2>{item.name}</h2>
            <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{item.unit}</span>
                <span className="font-bold text-green-800 text-lg">₹{item.price}</span>
            </div>
            {!cartItem ?
            <button className="flex items-center gap-2 text-center justify-center bg-green-600 hover:bg-green-700 mt-2 p-2 text-white rounded-full cursor-pointer transition-all duration-200 text-sm font-medium" onClick={()=>dispatch(addToCart({...item,quantity:1}))}>
                <ShoppingCart className="w-5 h-5"/>Add to Cart
            </button>
            :
            <div className="flex items-center justify-center gap-4 bg-green-50 rounded-full border border-green-200 px-4 py-2 mt-4">
                <button className="flex items-center justify-center rounded-full w-7 h-7 bg-green-100 hover:bg-green-200 transition-all cursor-pointer" onClick={() => dispatch(decreaseQuantity(item._id))}><Minus className="text-green-700" size={16}/></button>
                <span className="text-sm font-semibold text-gray-800">{cartItem.quantity}</span>
                <button className="flex items-center justify-center rounded-full w-7 h-7 bg-green-100 hover:bg-green-200 transition-all cursor-pointer" onClick={()=>dispatch(increaseQuantity(item._id))}> <Plus className="text-green-700" size={16}/></button>
            </div>
            }
        </div>
    </motion.div>
  )
}

export default GroceryItemCard
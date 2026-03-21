'use client'

import React, { useEffect, useState } from 'react'
import GroceryItemCard, { IGrocery } from './GroceryItemCard'
import { getSocket } from '@/lib/socket'
import toast from 'react-hot-toast'

const GroceryList = ({initialItems}:{initialItems : IGrocery[]}) => {
    const [items, setItems] = useState<IGrocery[]>(initialItems)

    useEffect(()=>{
        const socket = getSocket()
        socket.on("new-grocery-item",(newItem:IGrocery)=>{
            setItems((prev)=>[newItem,...prev])
            toast.success(`${newItem.name} added to the store`)
        })

        socket.on("item-deleted",(deletedId:string)=>{
            setItems((prev)=>prev.filter((item)=>item._id!==deletedId))
            toast.success("An item was removed from the store");
        })

        socket.on('item-updated',(updatedItem : IGrocery)=>{
            setItems((prev)=>prev.map((item)=>item._id==updatedItem._id ? updatedItem : item))
            toast.success('Item updated successfully')
        })

        return () => {
            socket.off("new-grocery-item")
            socket.off("item-deleted")
            socket.off('item-updated')
        }
    },[])
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6'>
        {items.map((item : IGrocery )=>(
                <GroceryItemCard item={item} key={item._id}/>
        ))}
    </div>
  )
}

export default GroceryList
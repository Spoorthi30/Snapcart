import React from 'react'
import DeliveryBoy from './DeliveryBoy'
import { auth } from '@/auth'
import Order from '@/models.ts/order.model'

const DeliveryBoyDashboard = async() => {
  const session = await auth()
  const deliveryBoyId = session?.user?.id

  const orders = await Order.find({
    assignedDeliveryBoy : deliveryBoyId,
    deliveryOtpVerify : true
  })

  const today = new Date().toDateString()
  const todaysOrder = orders.filter((order)=>new Date(order.deliveredAt).toDateString() === today).length
  const todaysEarning = todaysOrder * 40
  return (
    <>
      <DeliveryBoy earning={todaysEarning}/>
    </>
  )
}

export default DeliveryBoyDashboard
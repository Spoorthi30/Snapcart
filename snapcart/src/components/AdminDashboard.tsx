import AdminDashbaordClient from './AdminDashbaordClient'
import connectDB from '@/lib/db'
import Order from '@/models.ts/order.model'
import User from '@/models.ts/user.model'
import Grocery from '@/models.ts/grocery.model'

const AdminDashboard = async() => {

  await connectDB()

  const orders = await Order.find({})
  const users = await User.find({})
  const groceries = await Grocery.find({})

  const totalOrders = orders.length
  const totalUsers = users.length

  const pendingDeliveries = orders.filter((order)=> order.status === 'pending').length
  const totalRevenue = orders.reduce((sum,order)=>sum+(order.totalAmount || 0),0)

  const today = new Date()
  const startOfToday = new Date(today)
  startOfToday.setHours(0,0,0,0)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 6)

  const todaysOrder = orders.filter((o)=>new Date(o.createdAt) >= startOfToday)
  const todaysRevenue = todaysOrder.reduce((sum,o)=>sum+(o.totalAmount),0)

  const sevenDaysOrders = orders.filter((o)=>new Date(o.createdAt)>=sevenDaysAgo)
  const sevenDaysRevenue = sevenDaysOrders.reduce((sum,o)=>sum+(o.totalAmount),0)

  const stats = [
    {title : "Total Orders",value:totalOrders},
    {title : "Total Users",value:totalUsers},
    {title : "Pending Deliveries",value:pendingDeliveries},
    {title : "Total Revenue",value:totalRevenue},
  ]

  const chartData = []

  for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0,0,0,0)

      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate()+1)

      const ordersCount = orders.filter((order)=>new Date(order.createdAt)>=date && new Date(order.createdAt)<nextDay).length

      chartData.push({
        day : date.toLocaleDateString("en-US",{weekday:"short"}),
        orders : ordersCount
      })
  }


  return (
    <>
      <AdminDashbaordClient earnings={{
        today:todaysRevenue,
        sevenDaysRevenue : sevenDaysRevenue , 
        total : totalRevenue
      }}
      stats={stats}
      chartData={chartData}
      />
    </>
  )
}

export default AdminDashboard
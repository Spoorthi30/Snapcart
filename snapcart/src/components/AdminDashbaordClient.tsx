/* eslint-disable */

'use client'

import { IndianRupee, Package, Truck, User } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

type PropType = {
    earnings : {
        today:number,
        sevenDaysRevenue:number,
        total : number
    },
    stats: {
    title: string;
    value: number;
}[],
chartData: {
    day: string;
    orders: number;
}[]
}

const AdminDashbaordClient =({earnings,stats,chartData}:PropType) => {

    const [filter, setFilter] = useState<"today" | "sevenDayAgo" | "total">()

    const currentEarnings = filter === 'today' ? earnings.today 
                    : filter === 'sevenDayAgo' ? earnings.sevenDaysRevenue
                    : earnings.total

    const title = filter === 'today' ? "Today's Earnings" 
                    : filter === 'sevenDayAgo' ? "Last Seven Day's Earnings"
                    : "Total Earnings"

  return (
    <div className='pt-28 w-[90%] md:w-[80%] mx-auto'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 text-center sm:text-left'>
            <motion.h1
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.5}}
            className='text-3xl md:text-4xl font-bold text-green-700'
            >
                Admin Dashoard
            </motion.h1>
            <select className='border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none transition w-full sm:w-auto' onChange={(e)=>setFilter(e.target.value as any)} value={filter}>
                <option value="total">Total</option>
                <option value="sevenDayAgo">Last 7 days</option>
                <option value="today">Today</option>
            </select>
        </div>

        <div className='bg-green-50 border border-green-500 shadow-sm rounded-2xl p-6 text-center mt-10 '>
            <h2 className='text-lg font-semibold text-green-700 mb-2'>{title}</h2>
            <p className='text-4xl font-extrabold text-green-800'>₹{currentEarnings.toLocaleString()}</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4'>
            {stats.map((stat,index)=>{
                const icons = [
                    <Package key="p" className='text-green-700 w-6 h-6'/>,
                    <User key="u" className='text-green-700 w-6 h-6'/>,
                    <Truck key="t" className='text-green-700 w-6 h-6'/>,
                    <IndianRupee key="i" className='text-green-700 w-6 h-6'/>
                ]
                return <motion.div
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{delay:index*0.1}}
                key={index} className='bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all'>
                    <div className='bg-green-100 p-3 rounded-xl'>
                        {icons[index]}
                    </div>
                    <div>
                        <p className='text-gray-600 text-sm'>{stat.title}</p>
                        <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
                    </div>
                </motion.div>
            })}
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl shadow-md p-5 mb-10'>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>📈Orders Overview ( Last 7 Days )</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                     <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                     <XAxis dataKey="day"/>
                     <Tooltip />
                     <Bar dataKey="orders" fill="#16A34A" radius={[6,6,0,0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}

export default AdminDashbaordClient
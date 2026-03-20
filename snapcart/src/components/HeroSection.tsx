'use client'

// import { getSocket } from '@/lib/socket'
// import { RootState } from '@/redux/store'
import { Leaf, ShoppingBasket, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence , motion} from 'motion/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'

const HeroSection = () => {

    // const { userData } = useSelector((state:RootState)=>state.user)

    // useEffect(()=>{
    //     if(userData){
    //         const socket = getSocket()
    //         socket.emit("identity",userData?._id)
    //     }
    // },[userData])

    const slides = [
        {
            id : 1,
            icon : <Leaf className='w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg'/>,
            title : 'Fresh Organic Groceries 🥦',
            subtitle : 'Farm-fresh fruits , vegetable and daily essentials delevered to you.',
            btnText : 'Show Now',
            bg : "https://plus.unsplash.com/premium_photo-1683133448684-f4c274771692?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id : 2,
            icon : <Truck className='w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg'/>,
            title : 'Fast & Reliable Delivery 🚴',
            subtitle : 'We ensure you delivery will reach your doorstep in no time',
            btnText : 'Order Now',
            bg : "https://images.unsplash.com/photo-1642047291146-7916f38ebde0?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id : 3,
            icon : <Smartphone className='w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg'/>,
            title : 'Shop Anytime , Anywhere 📱',
            subtitle : 'Easy and seamless online grocery shopping experience',
            btnText : 'Get Started',
            bg : "https://plus.unsplash.com/premium_photo-1683133442375-501c81500fd8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ]

    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev+1)%(slides.length))
        }, 4000);
        return () => clearInterval(timer)
    })

  return (
    
    <div className='relative w-[98%] h-[80vh] mx-auto mt-28 rounded-2xl shadow-lg overflow-hidden'>
        <AnimatePresence mode='wait'>
            <motion.div
            key={current}
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.8}}
            exit={{opacity:0}}
            className=''
            >
                <Image src={slides[current]?.bg} alt='slide' fill className='object-cover'/>
                <div className='bg-black/50 backdrop-blur-[1px] absolute inset-0'/>
            </motion.div>
        </AnimatePresence>
        <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
            <motion.div
            initial={{y:30,opacity:0}}
            animate={{y:0,opacity:1}}
            transition={{duration:0.7}}
            className='flex flex-col items-center justify-center gap-6 max-w-4xl'
            >
                <div className='bg-white/10 rounded-full p-6 shadow-lg backdrop-blur-md'>{slides[current].icon}</div>
                <h2 className='text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight'>{slides[current].title}</h2>
                <p className='text-lg sm:text-xl max-w-2xl text-gray-200'>{slides[current].subtitle}</p>
                <motion.button 
                whileHover={{scale:1.09}}
                whileTap={{scale:0.96}}
                transition={{duration:0.2}}
                className='flex gap-2 bg-white text-green-700 hover:bg-green-100 cursor-pointer rounded-full px-8 py-3 font-semibold shadow-lg transition-all duration-200'>
                    <ShoppingBasket />
                    {slides[current].btnText}
                </motion.button>
            </motion.div>
        </div>
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3'>
            {slides.map((_,index)=>(
                <button key={index} className={`w-3 h-3 rounded-full transition-all ${
                    index === current ? 'bg-white w-6 ':'bg-white/50'}`}/>
            ))}
        </div>
    </div>
  )
}

export default HeroSection
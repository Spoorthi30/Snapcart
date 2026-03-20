'use client'

// import success from '@/../public/success1.png'
import { ArrowRight, CheckCircle, Package } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'


const OrderSuccess = () => {
  const router = useRouter()
  return (
    <div className='flex flex-col items-center justify-center bg-linear-to-b from-green-50 to-white min-h-[80vh] px-6'>
      {/* <Image src={success} alt='success' width={150} height={150} className='bg-green-50'/> */}
      <motion.div initial={{scale:0,rotate:-180}}
      animate={{scale:1,rotate:0}}
      transition={{
        type : "spring",
        damping : 10,
        stiffness : 100
      }}
      className='relative'
      >
        <CheckCircle className='text-green-600 h-24 w-24 md:h-28 md:w-28'/>
      </motion.div>
        <motion.h2
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}}
        className='font-bold text-3xl md:text-4xl text-green-700 mt-6 text-center'>Order Placed Successfully</motion.h2>
        <motion.p 
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}}
        className='text-xs font-medium max-w-md md:max-w-[40vw] text-center text-gray-500 my-2'>Thank you for shopping with us! Your order has been placed and is being proccessed.You can track its progress in <span className='text-green-700 font-extrabold'>My Order</span> section</motion.p>
        <motion.span
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:[0,-10,0]}}
        transition={{duration:2,delay:1,repeat:Infinity,ease:"easeInOut"}}
        >
          <Package className='text-green-600 w-15 h-15 mt-6'/>
        </motion.span>
        <motion.button onClick={() => router.push("/user/my-order")}
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:1}}
        className='flex items-center gap-1 text-white bg-green-600 rounded-full py-2 px-6 cursor-pointer hover:bg-green-700 transition-all mt-10'>
          Go to My Orders
          <ArrowRight />
          </motion.button>
        <motion.div
        initial={{opacity:0}}
        animate={{opacity:[0.2,0.6,0.2]}}
        transition={{
          duration:3,
          repeat:Infinity,
          ease:"easeInOut"
        }}
        className='absolute top-0 left-0 w-full h-full pointer-events-none'
        >
          <div className='absolute top-20 left-[10%] bg-green-400 rounded-full w-2 h-2 animate-bounce'/>
          <div className='absolute top-80 left-[20%] bg-green-400 rounded-full w-2 h-2 animate-bounce'/>
          <div className='absolute top-32 left-[30%] bg-green-400 rounded-full w-2 h-2 animate-bounce'/>
          <div className='absolute top-64 left-[90%] bg-green-400 rounded-full w-2 h-2 animate-bounce'/>
          <div className='absolute top-16 left-[70%] bg-green-400 rounded-full w-2 h-2 animate-bounce'/>
        </motion.div>
    </div>
  )
}

export default OrderSuccess
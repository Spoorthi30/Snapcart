'use client'

import { Apple, Baby, Box, ChevronLeft, ChevronRight, Coffee, Cookie, Flame, Heart, Home, Milk, Wheat } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const CategorySlider = () => {

    const [showLeft, setShowLeft] = useState<boolean>()
    const [showRight, setShowRight] = useState<boolean>()

    const categories = [
        {id : 1,name :"Fruits & Vegetable",icon:Apple,color:"bg-green-100"},
        {id : 2,name :"Dairy & Eggs",icon:Milk,color:"bg-yellow-100"},
        {id : 3,name :"Rice , Atta & Grains",icon:Wheat,color:"bg-orange-100"},
        {id : 4,name :"Snacks & Biscuit",icon:Cookie,color:"bg-pink-100"},
        {id : 5,name :"Spices & Masala",icon:Flame,color:"bg-red-100"},
        {id : 6,name :"Beverages & Drinks",icon:Coffee,color:"bg-blue-100"},
        {id : 7,name :"Personal Care",icon:Heart,color:"bg-purple-100"},
        {id : 8,name :"Household Essentials",icon:Home,color:"bg-lime-100"},
        {id : 9,name :"Tnstance & Packed Food",icon:Box,color:"bg-teal-100"},
        {id : 10,name :"Baby & Pet Care",icon:Baby,color:"bg-rose-100"}
    ]

    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = (direction:"left" | "right") => {
        if(!scrollRef.current) return 
        const scrollAmount = direction == "left" ? -300 : 300
        scrollRef.current.scrollBy({left:scrollAmount,behavior:"smooth"})
    }

    const checkScroll = () => {
        if(!scrollRef.current) return

        const {scrollLeft , scrollWidth , clientWidth}=scrollRef.current
        setShowLeft(scrollLeft>0)
        setShowRight((scrollLeft+clientWidth) < scrollWidth-5)
    }


    // autometically scroll
    useEffect(() => {
        const autoScroll = setInterval(()=>{
            if(!scrollRef.current) return
            const { scrollLeft , scrollWidth,clientWidth} = scrollRef.current
            if((scrollLeft+clientWidth) >= scrollWidth-5){
                scrollRef.current.scrollTo({left:0,behavior:"smooth"})
            }else{
                scrollRef.current.scrollBy({left:300,behavior:"smooth"})
            }
        },4000)
        return () => clearInterval(autoScroll)
    },[])

    // scroll manually
    useEffect(()=>{
        scrollRef.current?.addEventListener("scroll",checkScroll)
        checkScroll()
        return ()=> removeEventListener("scroll",checkScroll)
    },[])

  return (
    <motion.div
    initial={{opacity:0,y:50}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:false}}
    className='w-[90%] md:w-[80%] relative mx-auto mt-10'
    >
        <h2 className='text-2xl md:text-3xl text-green-700 font-bold mb-6 text-center'>🛒Shop By Category</h2>
        {showLeft && 
            <button className='absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-center bg-white hover:bg-green-100 shadow-lg z-10 rounded-full h-10 w-10' onClick={()=>scroll("left")}><ChevronLeft className='w-5 h-5 text-green-700'/></button>
        }
        <div className='flex gap-6 px-10 pb-4 overflow-x-auto scrollbar-hide scroll-smooth' ref={scrollRef}>
            {categories.map((category)=>{
                const Icon = category.icon
                return (
                    <motion.div key={category.id}
                    className={`m-x-w-[150px] md:min-w-[180px] flex flex-col justify-center items-center rounded-2xl ${category.color}
                        shadow-md hover:shadow-xl transition-all cursor-pointer`}
                    >

                        <div className='flex flex-col items-center justify-center p-5'>
                            <Icon className='w-10 h-10 text-green-700 mb-4'/>
                            <p className='text-center text-sm md:text-base text-gray-700 font-semibold'>{category.name}</p>
                        </div>
                    </motion.div>
                )})}
        </div>
        {showRight && 
            <button className='absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center bg-white hover:bg-green-100 shadow-lg z-10 rounded-full h-10 w-10' onClick={()=>scroll("right")}><ChevronRight className='w-5 h-5 text-green-700'/></button>
}
    </motion.div>
  )
}

export default CategorySlider
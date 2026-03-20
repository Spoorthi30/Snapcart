'use client'

import { ArrowRight, Bike, ShoppingBasket } from "lucide-react"
import { motion } from "motion/react"

type propType = {
    nextStep:(s:number) => void
}

const Welcome = ({nextStep}:propType) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <motion.div 
        initial = {{
            opacity : 0,
            y : -20
        }}
        animate = {{
            opacity : 1,
            y : 0
        }}
        transition = {{
            duration : 0.6
        }}
        className="flex gap-3 items-center"
        >
            <ShoppingBasket className="w-10 h-10 text-green-600"/>
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-700">Snapcart</h2>
        </motion.div>
        <motion.p 
        initial = {{
            opacity : 0,
            y : -20
        }}
        animate = {{
            opacity : 1,
            y : 0
        }}
        transition = {{
            duration : 0.6,
            delay:0.5
        }}
        className="text-lg text-gray-700 max-w-lg text-center mt-4"
        >
            You are one-step destination for fresh groceries , organic produce and daily essentials delivered right to your doorstep
        </motion.p>
        <motion.div 
        initial = {{
            opacity : 0,
            scale : 0
        }}
        animate = {{
            opacity : 1,
            scale : 1
        }}
        transition = {{
            duration : 0.6,
            delay:0.5
        }}
        className="flex items-center gap-4"
        >
            <ShoppingBasket className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md text-green-600"/>
            <Bike className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md text-orange-600"/>
        </motion.div>
        <motion.button 
        initial = {{
            opacity : 0,
            scale : 0
        }}
        animate = {{
            opacity : 1,
            scale : 1
        }}
        transition = {{
            duration : 0.6,
            delay:0.8
        }}
        className="flex items-center gap-2 bg-green-600 rounded-2xl py-3 px-8 text-white cursor-pointer hover:bg-green-700 font-semibold shadow transition-all duration-200 mt-4"
        onClick={()=>nextStep(2)}
        >
            <ArrowRight size={18}/> Next
        </motion.button>

    </div>
  )
}

export default Welcome
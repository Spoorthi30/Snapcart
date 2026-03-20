'use client'

import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/cartSlice'
import { RootState } from '@/redux/store'
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from 'lucide-react'
import { AnimatePresence , motion} from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

const CartPage = () => {

    const {cartData,subTotal,deliveryFee,total} = useSelector((state:RootState)=> state.cart)
    const dispatch = useDispatch()
    const router = useRouter()

  return (
    <div className='w-[95%] sm:w-[90%] md:w-[80%] relative mb-24 mt-8 mx-auto'>
        <Link href={"/"} className='absolute -top-5 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-all'>
            <ArrowLeft className='w-5 h-5'/>
            <span className='hidden sm:inline'>Go to home</span>
        </Link>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-700 mb-10'>🛒Your Shopping Cart</h2>
        {cartData.length == 0 ? (
            <div className='text-center bg-white py-8'>
                <ShoppingBasket className='w-10 h-10 text-gray-400  mx-auto mb-4'/>
                <p className='text-gray-600 text-sm mb-4 font-medium'>Your cart is empty .Add some groceries to the cart</p>
                <Link href={"/"} className='bg-green-600 text-white font-semibold px-4 py-2 rounded-full'>Continue Shopping</Link>
            </div>
        ) 
        : 
        (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-y-2 md:gap-8 w-full items-center justify-center'>
                <div className='col-span-2 space-y-8'>
                    <AnimatePresence>
                        {cartData.map((item,index)=>(
                            <motion.div key={index}
                            initial = {{opacity:0,y:30}}
                            animate = {{opacity:1,y:0}}
                            exit={{opacity:0,y:-20}}
                            className='bg-white p-6 shadow-lg hover:shadow-xl flex flex-row items-center justify-center  rounded-2xl'>
                                <div className='overflow-hidden bg-white m-auto flex items-center'>
                                    <Image src={item.image} alt={item.name} width={80} height={80}  className='object-contain'/>
                                </div>
                                <div className='mt-4 sm:mt-0 text-left ml-4 flex-1'>
                                    <h3 className='text-base sm:text-lg font-semibold text-gray-800 line-clamp-1 capitalize'>{item.name}</h3>
                                    <p className='text-xs sm:text-sm text-gray-500'>{item.unit}</p>
                                    <p className='text-sm sm:text-base text-green-800 mt-1 font-semibold'>₹{Number(item.price)*(item.quantity)}</p>
                                </div>
                                <div className='flex items-center gap-4 bg-green-50 px-3 py-2 rounded-full'>
                                    <button className='w-5 h-5 bg-white rounded-full flex items-center justify-center cursor-pointer' onClick={()=>dispatch(decreaseQuantity(item._id))}><Minus className='w-5 h-5 text-green-700'/></button>
                                    <span className='text-gray-800 text-centerw-6 font-semibold'>{item.quantity}</span>
                                    <button className='w-5 h-5 bg-white rounded-full flex items-center justify-center cursor-pointer' onClick={()=>dispatch(increaseQuantity(item._id))}><Plus className='w-5 h-5 text-green-700'/></button>
                                </div>
                                <button className='sm:ml-4 mt-3 sm:mt-0 text-red-500 hover:text-red-700 transition-all cursor-pointer' onClick={() => dispatch(removeFromCart(item._id))}><Trash2 className='w-5 h-5'/></button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className='bg-white sticky top-24 p-6  border border-gray-100 shadow-xl flex flex-col rounded-2xl h-fit w-full'>
                    <h2 className='text-gray-800 font-semibold text-lg md:text-xl mb-4'>Order Summery</h2>
                    <div className='text-gray-700 sm:text-base space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span>Subtotal </span>
                            <span className='text-green-700 font-semibold'>₹{subTotal}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span>Delivery Fee </span>
                            <span className='text-green-700 font-semibold'>₹{deliveryFee}</span>
                        </div>
                        <hr className='text-gray-300'/>
                        <div className='flex items-center justify-between font-bold text-lg'>
                            <span>Total </span>
                            <span className='text-gray-800'>₹{total}</span>
                        </div>
                    </div>
                    <motion.button whileTap={{scale:0.5}} className='bg-green-600 rounded-full w-full py-2 text-white mt-4 cursor-pointer font-semibold hover:bg-green-700 transition-all duration-300' onClick={()=>router.push('/user/checkout')}>
                        Proceed to checkout
                    </motion.button>
                </div>
            </div>
        )}
    </div>
  )
}

export default CartPage
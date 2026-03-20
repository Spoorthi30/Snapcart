'use client'

import { RootState } from '@/redux/store'
import { Boxes, ClipboardCheck, LogOut, Menu, Package, PlusCircle, Search, ShoppingCart, User, X } from 'lucide-react'
import mongoose from 'mongoose'
import { AnimatePresence , motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'

interface IUser{
    _id? : mongoose.Types.ObjectId,
    name : string,
    email : string,
    password : string,
    role : "user" | "admin" | "deliveryBoy",
    mobile : string,
    image?:string
}

const menuItems = [
    {
        icon :PlusCircle ,
        menu : 'Add Grocery',
        href : '/admin/add-grocery'
    },
    {
        icon :Boxes,
        menu : 'View Grocery',
        href : '/admin/view-grocery'
    },
    {
        icon :ClipboardCheck,
        menu : 'Manage Order',
        href : '/admin/get-orders'
    }
]

const Nav = ({user}:{user:IUser}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [search, setSearch] = useState('')
    const router = useRouter()

    const {cartData} = useSelector((state:RootState)=>state.cart)

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault()
        const q = search.trim()
        if(!q) {
            return router.push("/")
        }

        router.push(`/?q=${encodeURIComponent(q)}`)
        setSearch("")
        setIsSearchBarOpen(false)
    }

    const sideBar = menuOpen?createPortal(
        <AnimatePresence>
            <motion.div 
            initial={{x:-100,opacity:0}}
            animate={{x:0,opacity:1}}
            transition={{duration:0.6}}
            exit={{x:-100,opacity:0}}
            className='fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-9999 bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90 backdrop-blur-xl border-r border-green-400/20 flex flex-col p-6 text-white shadow-[0px_0px_50px_-10px_rgba(0,255,100,0.3)]'
            >
                <div className='flex items-center justify-between'>
                    <h2 className='font-extrabold tracking-wide text-green-100 text-2xl'>Admin Panel</h2>
                    <button className='text-green-100 hover:text-red-100' onClick={()=>setMenuOpen(!menuOpen)}><X/></button>
                </div>
                <div className='flex items-center gap-3 p-3 mt-3 bg-white/10 hover:bg-white/15 shadow-inner rounded-xl'>
                    <div className=' bg-red-500 h-11 w-11 rounded-full flex items-center justify-center overflow-hidden shadow-md transition-transform cursor-pointer'onClick={()=>setIsOpen(!isOpen)}>
                        {user.image ? <Image src={user.image} alt='user' fill className='object-cover rounded-full'/> : <User />}
                    </div>
                    <div>
                        <h3 className='font-bold text-lg'>{user.name}</h3>
                        <p className='font-semibold text-xs text-green-200 capitalize'>{user.role}</p>
                    </div>
                </div>
                {/* <div className='flex flex-col gap-4 mt-6'>
                    <div className='flex gap-3 items-center bg-white/10 text-green-100 font-bold text-lg p-3 rounded-xl shadow-inner'>
                        <PlusCircle className='w-5 h-5'/>
                        Add Grocery
                    </div>

                    <div className='flex gap-3 items-center bg-white/10 text-green-100 font-bold text-lg p-3 rounded-xl shadow-inner'>
                        <Boxes className='w-5 h-5'/>
                        View Grocery
                    </div>

                    <div className='flex gap-3 items-center bg-white/10 text-green-100 font-bold text-lg p-3 rounded-xl shadow-inner'>
                        <ClipboardCheck className='w-5 h-5'/>
                        Manage Orders
                    </div>
                </div> */}
                <div className='flex flex-col gap-4 mt-6'>
                    {menuItems.map((item)=>{
                        const Icon = item.icon
                        return (
                        <Link href={item.href} key={item.menu} className='flex gap-3 items-center bg-white/10 text-green-100 font-bold text-lg p-3 rounded-xl shadow-inner'>
                            <Icon className='w-5 h-5'/>
                            {item.menu}
                        </Link>
                    )})}
                </div>
                <div className='my-5 border-t border-white/20'></div>
                <div className='flex items-center text-lg font-semibold gap-3 text-red-300 hover:bg-red-500 mt-auto p-3 rounded-lg transition-all'
                onClick={async() => await signOut({callbackUrl:"/login"})}
                >
                    <LogOut className='w-5 h-5'/>
                    Log out
                </div>
            </motion.div>
        </AnimatePresence>,document.body
    ) : null
  return (
    <nav className='w-[95%] h-16 bg-linear-to-r from-green-500 to-green-700 fixed top-4 left-1/2 -translate-x-1/2 px-4 md:px-8 z-50 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center'>
        <Link href={"/"} className='text-white font-bold tracking-wide hover:scale-105 text-2xl sm:text-3xl transition-transform'>SnapCart</Link>
        {user.role === "user" &&
            <form className='hidden md:flex items-center bg-white px-2 py-2 w-1/2 max-w-lg rounded-full' onSubmit={handleSubmit}>
                <Search className='w-5 h-5 mr-2 text-gray-500'/>
                <input type="text" placeholder='Search groceries' className='focus:outline-none w-full text-green-700 placeholder-gray-400'
                value={search} onChange={(e)=>setSearch(e.target.value)}
                />
            </form>
        }
        <div className='flex items-center gap-6 relative'>
            {user.role === 'user' &&
                <>
                    <div className='bg-white h-11 w-11 rounded-full flex items-center justify-center md:hidden shadow-md transition'
                        onClick={()=>setIsSearchBarOpen(!isSearchBarOpen)}>
                        <Search className='w-6 h-6 text-green-600  cursor-pointer'/>
                    </div>
                    <Link href={'/user/cart'} className='relative bg-white h-11 w-11 rounded-full flex items-center justify-center'>
                        <ShoppingCart className='w-6 h-6 text-green-600'/>
                        <span className='absolute -top-1 -right-1 flex w-5 h-5 rounded-full bg-red-500 text-white items-center justify-center text-xs'>{cartData.length}</span>
                    </Link>
                </>
            }

            {user.role == 'admin' && 
                <>
                    <div className='hidden lg:flex items-center gap-4'>
                    <Link href={"/admin/add-grocery"} className='bg-white rounded-full px-4 py-2 hover:bg-green-100 transition-all text-green-700 font-semibold flex items-center gap-2'><PlusCircle className='w-4 h-4'/>Add Grocery</Link>
                    <Link href={"/admin/view-grocery"} className='bg-white rounded-full px-4 py-2 hover:bg-green-100 transition-all text-green-700 font-semibold flex items-center gap-2'><Boxes className='w-4 h-4'/>View Grocery</Link>
                    <Link href={"/admin/get-orders"} className='bg-white rounded-full px-4 py-2 hover:bg-green-100 transition-all text-green-700 font-semibold flex items-center gap-2'><ClipboardCheck className='w-4 h-4'/>Manage Orders</Link>
                    </div>
                    <div className='lg:hidden bg-white rounded-full p-2.5 ' onClick={()=>setMenuOpen(!menuOpen)}>
                        <Menu className='w-6 h-6 text-green-600'/> 
                    </div>
                 </>
            }

            <div className='relative'>
                <div className=' bg-red-500 h-11 w-11 rounded-full flex items-center justify-center overflow-hidden shadow-md transition-transform cursor-pointer'onClick={()=>setIsOpen(!isOpen)}>
                    {user.image ? <Image src={user.image} alt='user' fill className='object-cover rounded-full'/> : <User />}
                </div>
                <AnimatePresence>
                    {isOpen && 
                    <motion.div
                    initial={{opacity:0 , y:-10 , scale:0.95}}
                    animate = {{opacity:1,y:0,scale:1}}
                    transition={{duration:0.6}}
                    exit={{opacity:0,y:-10,scale:0.95}}
                    className='absolute right-0 bg-white w-56 mt-3 border border-gray-300 shadow-xl rounded-2xl p-3 z-999'>
                        <div className='flex items-center gap-3 px-3 py-2  border-b border-gray-100'>
                            <div className='relative w-10 h-10 flex items-center justify-center bg-green-100 rounded-full  overflow-hidden'>
                                {user.image ? <Image src={user.image} alt='user' fill className='object-cover rounded-full'/> : <User />}
                            </div>
                            <div>
                                <div className='text-gray-800 font-semibold'>{user.name}</div>
                                <div className='text-xs text-gray-500 capitalize'>{user.role}</div>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 p-3 text-gray-700 font-medium rounded-lg hover:bg-green-50 cursor-pointer' onClick={()=>router.push('/profile')}>
                            <User className='text-green-700 w-5 h-5'/>
                            Profile
                        </div>
                        {user.role === "user" &&
                            <Link href={"/user/my-order"} className='flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 text-gray-700 font-medium'
                            onClick={()=>setIsOpen(!open)}>
                                <Package className='w-5 h-5 text-green-700'/>
                                My orders
                            </Link>
                        }
                        <button className='flex items-center gap-3 p-3 font-medium hover:bg-red-50 rounded-lg text-left w-full'
                        onClick={() => {setIsOpen(!open)
                                signOut({callbackUrl:"/login"})
                        }}
                        >
                            <LogOut className='w-4 h-4 text-red-600'/>
                            Logout
                        </button>
                    </motion.div>
                    }
                </AnimatePresence>

                <AnimatePresence>
                    {isSearchBarOpen && 
                    <motion.div
                    initial={{opacity:0 , y:-10 , scale:0.95}}
                    animate = {{opacity:1,y:0,scale:1}}
                    transition={{duration:0.6}}
                    exit={{opacity:0,y:-10,scale:0.95}}
                    className='fixed top-16 left-1/2 -translate-x-1/2 bg-white w-[90%] mt-3 border border-gray-300 shadow rounded-full p-3 z-40 flex items-center px-4 py-2'>
                        <Search className='w-5 h-5 mr-2 text-gray-500'/>
                        <form className='grow' onSubmit={handleSubmit}>
                            <input type="text" className='text-gray-700 outline-none w-full' value={search} onChange={(e)=>setSearch(e.target.value)}/>
                        </form>
                        <button onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}>
                            <X className='text-gray-700 w-5 h-5 cursor-pointer'/>
                        </button>
                    </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div>
        {sideBar}
    </nav>
  )
}

export default Nav
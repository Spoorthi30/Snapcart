'use client'

import { ArrowLeft, Eye, EyeOff, Leaf,Loader2,Lock, LogIn, Mail} from 'lucide-react'
import { motion } from "motion/react"
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { FaGithub } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const session = useSession()

  const isFormValid = email!=="" && password!==""

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn("credentials",{
        email , password,
        redirect:false
      })
      if(result?.error){
        setLoading(false)
        toast.error('Invalid credentials')
        console.log(result.error)
      }else{
        setLoading(false)
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-white relative'>
      <div className='flex items-center gap-2 text-green-600 font-semibold absolute top-6 left-6 transition-colors cursor-pointer hover:text-green-700' onClick={()=>router.push('/register')}>
        <ArrowLeft className='w-5 h-5'/>
        Back
      </div>
      <motion.h2
      initial = {{
        y : -10,
        opacity : 0
      }}
      animate = {{
        y : 0,
        opacity : 1
      }}
      transition = {{
        duration : 0.6
      }}
      className='text-green-600 text-2xl md:text-3xl font-bold'>Sign In</motion.h2>
      <p className='text-green-800 flex items-center gap-1 mt-2 mb-10'>Join Snapcart today<Leaf size={15} className='text-green-500'/></p>
      <form className='flex flex-col gap-6 max-w-sm w-full' onSubmit={handleSubmit}>
        <div className='relative'>
          <Mail className='absolute top-3 left-3.5 w-5 h-5 text-gray-400'/>
          <input type='email' placeholder='Your Email' className='w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800'
          onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </div>
        <div className='relative'>
          <Lock className='absolute top-3 left-3.5 w-5 h-5 text-gray-400'/>
          <input type={showPassword ? 'text' : 'password'} placeholder='Your Password' className='w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800'
          onChange={(e)=>setPassword(e.target.value)} value={password}/>
          <button type='button' className='absolute top-3 right-3.5 text-gray-400 cursor-pointer' onClick={()=>setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className='w-5 h-5'/> : <Eye className='w-5 h-5'/>}
          </button>
        </div>
        {/* <div className='w-full bg-violet-200 text-gray-700 py-3 font-semibold text-center rounded-2xl cursor-pointer'>
          Register
        </div> */}
        <button disabled={!isFormValid || loading}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-150 shadow-md inline-flex items-center justify-center gap-2 ${
                isFormValid
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
            { loading ? <Loader2 className='w-5 h-5 animate-spin'/> : "Login"}
        </button>
        <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
          <span className='flex-1 h-px bg-gray-300'></span>
          OR
          <span className='flex-1 h-px bg-gray-300'></span>
        </div>
        <button type="button" className='w-full border border-gray-400 text-gray-700 py-3 font-semibold rounded-2xl flex items-center justify-center gap-6 cursor-pointer' onClick={()=>signIn("github",{ callbackUrl: "/" })}>
           <FaGithub />Continue with Github
        </button>
      </form>
        <div className='flex items-center mt-4 text-sm font-medium'>Dont have an account ? 
          <span className='flex items-center text-green-700 font-semibold'><LogIn className='w-4 h-4 mx-1'/> <Link href='/register'>Register</Link></span>
        </div>
        <Link href={'/forgot-password'} className='text-sm font-medium text-green-700 mt-2'>Forgot Password?</Link>
    </div>
  )
}

export default Login
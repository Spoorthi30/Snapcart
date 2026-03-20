'use client'

import axios from 'axios'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")

        setLoading(false)
        try {
            const result = await axios.post('/api/auth/forgot-password',{email});
            console.log(result.data)
            toast.success(result.data.message);
            setIsSubmitted(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong");
            setLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className='flex items-center justify-center w-full min-h-screen'>
                <div className='text-center p-8 bg-green-50 rounded-2xl'>
                    <h2 className='text-2xl font-bold text-green-700'>Check your Email!</h2>
                    <p className='text-gray-600 mt-2'>If an account exists, a reset link has been sent.</p>
                </div>
            </div>
        )
    }
    
  return (
    <div className='flex items-center justify-center w-full min-h-screen'>
        <div className='bg-white w-full max-w-md p-8 rounded-2xl shadow-sm'>
            <div className='text-xl sm:text-3xl font-semibold text-green-700 text-center'>Forgot Password</div>
            <form className='mt-4' onSubmit={handleSubmit}>
                <label className='text-sm text-gray-500 font-medium'>Email</label>
                <input type='email' name='email' placeholder='Enter Your Email' className='w-full border border-gray-300 rounded-xl py-2 pl-2 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 text-sm font-medium'
                />
                <button disabled={loading} type="submit" 
                        className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4 w-full cursor-pointer transition-all'
                    >
                        {loading ? "Sending..." : "Submit"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default ForgotPassword
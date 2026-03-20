/* eslint-disable */

'use client'

import axios from 'axios'
import { Eye, EyeOff, Loader } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

const PasswordReset = () => {
    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState(false)
    const [newPassword, setNewPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        if(data.newPassword !== data.confirmPassword){
            toast.error('Password does not match')
            return
        }

        setLoading(true)
        try {
            const result = await axios.post('/api/profile/reset-password',data)
            toast.success('Password updated successfully')
            formRef.current?.reset()
            setLoading(false)
        } catch (error:any) {
            setLoading(false)
            const errorMessage = error.response?.data?.message || 'An unexpected error occured'
            toast.error(errorMessage)
            console.log(error)
        }
    }
  return (
    <form onSubmit={handleSubmit} ref={formRef} className='max-w-md mx-auto md:mx-0'>
        <h2 className='text-xl font-medium text-green-700 pb-5'>Reset Password</h2>
        <div>
            <label htmlFor='current-password' className='text-gray-500 text-sm font-medium'>Current Password<span className='text-red-500 pr-2'>*</span></label>
            <div className='relative '>
                <input type={currentPassword ? 'text' : 'password'} name='currentPassword' 
                    className='border border-gray-300 outline-none px-3 pl-3 pr-10 py-1.5 rounded-lg bg-green-100/50 text-green-700 text-sm font-medium w-full' />
            
                <button type='button' 
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition-colors cursor-pointer' onClick={() => setCurrentPassword(!currentPassword)}
                >
                {currentPassword ? <EyeOff className='w-4 h-4'/> : <Eye className='w-4 h-4'/>}
                </button>
            </div>
        </div>
         <div className='mt-4'>
            <label htmlFor='new-password' className='text-gray-500 text-sm font-medium'>New Password<span className='text-red-500 pr-6'>*</span></label>
             <div className='relative'>
                <input type={newPassword ? 'text' : 'password'} name='newPassword' 
                className='w-full border border-gray-300 outline-none px-3 pr-10 py-1.5 rounded-lg bg-green-100/50 text-green-700 text-sm font-medium' />
        
                <button type='button' 
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition-colors cursor-pointer' onClick={() => setNewPassword(!newPassword)}
                >
                {newPassword ? <EyeOff className='w-4 h-4'/> : <Eye className='w-4 h-4'/>}
                </button>
             </div>
        </div>
         <div className='mt-4'>
            <label htmlFor='confirm-password' className='text-gray-500 text-sm font-medium'>Confirm Password<span className='text-red-500 pr-2'>*</span></label>
             <div className='relative'>
                <input type={confirmPassword ? 'text' : 'password'} name='confirmPassword' 
                className='w-full border border-gray-300 outline-none px-3 pr-10 py-1.5 rounded-lg bg-green-100/50 text-green-700 text-sm font-medium' />
        
                <button type='button' 
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition-colors cursor-pointer' onClick={() => setConfirmPassword(!confirmPassword)}
                >
                {confirmPassword ? <EyeOff className='w-4 h-4'/> : <Eye className='w-4 h-4'/>}
                </button>
             </div>
        </div>
        <div className='text-center'>
            <button disabled={loading} type='submit' className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 cursor-pointer mt-4'>
                {loading ? <Loader className='w-5 h-5 animate-spin'/> : 'Save'}    
            </button>
        </div>
    </form>
  )
}

export default PasswordReset
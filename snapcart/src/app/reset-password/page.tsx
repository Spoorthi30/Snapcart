'use client'

import axios from "axios"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import toast from "react-hot-toast"

const ResetPasswordContent = () => {

  const searchParams = useSearchParams()
  const router = useRouter()

  const {data:session , status} = useSession()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = searchParams.get('token')
  const id = searchParams.get('id')

  useEffect(()=>{
    if(status === 'authenticated'){
      router.push("/")
      return
    }

    if(!token || !id){
      toast.error("Invalid access. Please request a new link.")
      router.push("/forgot-password")
    }
  },[token, id, status, router])

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const {password,confirmPassword} = Object.fromEntries(formData.entries())

    if(password !== confirmPassword){
      return toast.error('Password does not match')
    }

    setLoading(true)
    try {
      const result = await axios.post('/api/auth/reset-password',{password,token,id})
      // console.log(result.data)
      toast.success("Password reset successful!")
      router.push('/login')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  if (status === "loading" || !token || !id || status === "authenticated") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-green-600 w-10 h-10" />
            </div>
        );
    }

  return (
    <div className='flex items-center justify-center w-full min-h-screen'>
      <div className='bg-white w-full max-w-md p-8 rounded-2xl shadow-sm'>
        <h2 className='text-2xl font-medium text-green-600 text-center'>Reset Password</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className='relative'>
            <label className='text-sm text-gray-500 font-medium'>New Password</label>
            <div className='relative'>
                <input name="password" type={showPassword ? 'text' : 'password'}
                  className='w-full border border-gray-300 rounded-xl py-2 px-4 focus:ring-2 focus:ring-green-500 outline-none'
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>
          </div>
          <div className='relative mt-4'>
            <label className='text-sm text-gray-500 font-medium'>Confirm Password</label>
            <div className='relative'>
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                  className='w-full border border-gray-300 rounded-xl py-2 px-4 focus:ring-2 focus:ring-green-500 outline-none'
                />
                <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                >
                    {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>
          </div>
          <button 
            disabled={loading || !token}
            className='bg-green-600 text-white py-3 rounded-xl w-full hover:bg-green-700 mt-4 font-semibold flex items-center justify-center gap-2'
          >
            {loading ? <Loader2 className='animate-spin' /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { CheckCircle, XCircle, Loader2, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

const VerifyEmailContent = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const token = searchParams.get('token')
    const action = searchParams.get('action') // 'confirm' or 'cancel'
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'cancelled'>('loading')
    const [message, setMessage] = useState('Verifying your request...')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Invalid or missing verification token.')
            return
        }

        const handleVerification = async () => {
            try {
                // We send the token and the action to one single API
                const res = await axios.post('/api/auth/verify-email-update', { token, action })
                
                if (action === 'cancel') {
                    setStatus('cancelled')
                    setMessage('Email change has been cancelled. Your account is secure.')
                } else {
                    setStatus('success')
                    setMessage('Your email has been successfully updated!')
                }
            } catch (error: any) {
                setStatus('error')
                setMessage(error.response?.data?.message || 'Verification failed or link expired.')
            }
        }

        handleVerification()
    }, [token, action])

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 p-4'>
            <div className='max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center'>
                {status === 'loading' && (
                    <div className='flex flex-col items-center gap-4'>
                        <Loader2 className='w-12 h-12 text-green-600 animate-spin' />
                        <p className='text-gray-600 font-medium'>{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className='flex flex-col items-center gap-4'>
                        <CheckCircle className='w-16 h-16 text-green-500' />
                        <h2 className='text-2xl font-bold text-gray-800'>Success!</h2>
                        <p className='text-gray-600'>{message}</p>
                        <button onClick={() => router.push('/login')} className='mt-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-all'>
                            Login Now
                        </button>
                    </div>
                )}

                {status === 'cancelled' && (
                    <div className='flex flex-col items-center gap-4'>
                        <ShieldAlert className='w-16 h-16 text-orange-500' />
                        <h2 className='text-2xl font-bold text-gray-800'>Action Cancelled</h2>
                        <p className='text-gray-600'>{message}</p>
                        <button onClick={() => router.push('/')} className='mt-4 bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-gray-900 transition-all'>
                            Go to Home
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className='flex flex-col items-center gap-4'>
                        <XCircle className='w-16 h-16 text-red-500' />
                        <h2 className='text-2xl font-bold text-gray-800'>Invalid Link</h2>
                        <p className='text-gray-600'>{message}</p>
                        <button onClick={() => router.push('/profile')} className='mt-4 text-green-700 font-medium hover:underline'>
                            Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-green-600"/></div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
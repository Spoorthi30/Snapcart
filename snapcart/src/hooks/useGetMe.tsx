'use client'

import { AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function useGetMe() {
    const dispatch = useDispatch<AppDispatch>()
    const { status } = useSession()
  useEffect(()=>{
    const getMe = async() =>{
        try {
            const result = await axios.get('/api/me')
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    if (status === "authenticated") {
            getMe()
        }
  },[status, dispatch])
}

export default useGetMe
'use client'

import PasswordReset from '@/components/PasswordReset'
import PersonalInfo from '@/components/PersonalInfo'
import { IUser } from '@/models.ts/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal')
    // const [data, setData] = useState<IUser | null>(null)
    const {userData:data} = useSelector((state:RootState)=>state.user)

    // useEffect(()=>{
    //     const getUser = async() =>{
    //         try {
    //             const result = await axios.get('/api/me')
    //             // console.log(result.data)
    //             setData(result.data)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     getUser()
    // },[])
//   return (
//     <div className='w-[95%] sm:w-[90%] md:w-[80%] mx-auto bg-gray-100/50 min-h-screen'>
//         <Link href={'/'} className='relative top-2 flex items-center gap-1 font-medium rounded-lg px-4 py-2 w-fit cursor-pointer text-green-700 hover:text-green-800'>
//             <ArrowLeft/>
//             <span className='hidden sm:inline'>Back</span>
//         </Link>
//         <h2 className='text-4xl md:text-3xl sm:text-xl font-bold text-green-700 text-center'>Manage Your profile</h2>
//         <div className='w-full max-w-4xl mx-auto mt-8 flex gap-2'>
//             <div className='w-1/3 bg-white px-6 py-2 hidden md:inline'>
//                 <div className='flex flex-col items-center pb-4'>
//                     <div className='relative w-25 h-25 rounded-full border-4 border-green-700 overflow-hidden'>
//                         {data?.image ? <Image src={data.image} alt={data.name} fill className='object-cover rounded-full'/> : <span className='text-black font-semibold text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>{data?.name ? data.name.charAt(0) : ''}</span>}
//                     </div>
//                     <p className='text-gray-800 font-medium'>{data?.name}</p>
//                 </div>
//                 <div className='flex flex-col items-start gap-3 text-green-800 font-medium'>
//                     <div onClick={()=>setActiveTab('personal')} className='bg-green-100/50 w-full rounded-lg px-4 py-2 cursor-pointer'>Personal Information</div>
//                     <div onClick={()=>setActiveTab('reset-password')} className='bg-green-100/50 w-full rounded-lg px-4 py-2 cursor-pointer'>Reset Password</div>
//                     <button className='bg-red-100/50 w-full rounded-lg px-4 py-2 cursor-pointer text-start' onClick={()=>signOut({callbackUrl:'/login'})}>Log Out</button>
//                 </div>
//             </div>
//             <div className='w-full md:w-2/3 p-4 bg-white'>
//                 {/* {activeTab ==='personal' ? <PersonalInfo data={data}/>:<PasswordReset />} */}
//                 {activeTab ==='personal' ? <PersonalInfo />:<PasswordReset />}
//             </div>
//         </div>
//     </div>
//   )

return (
    <div className='w-[95%] sm:w-[90%] md:w-[80%] mx-auto bg-gray-100/50 min-h-screen'>
        <div className='flex items-center justify-between pt-6'>
            <Link href={'/'} className='relative top-2 flex items-center gap-1 font-medium rounded-lg px-4 py-2 w-fit cursor-pointer text-green-700 hover:text-green-800 transition-all'>
                <ArrowLeft/>
                <span className='hidden sm:inline'>Back</span>
            </Link>
            <button className='md:hidden cursor-pointer text-red-500 font-medium text-sm' onClick={()=>signOut({callbackUrl:'/login'})}>Log Out</button>
        </div>
        <h2 className='text-2xl md:text-3xl font-bold text-green-700 text-center mt-4'>Manage Your profile</h2>
        <div className='w-full mx-auto mt-8 flex gap-6'>
            
            <div className='hidden md:flex flex-col w-1/3 bg-white p-6 rounded-2xl h-fit shadow-sm border border-gray-100'>
                <div className='flex flex-col items-center pb-4'>
                    <div className='relative w-25 h-25 rounded-full border-4 border-green-700 overflow-hidden mb-3'>
                        {data?.image ? <Image src={data.image} alt={data.name} fill className='object-cover rounded-full'/> : <span className='w-full h-full bg-green-100 flex items-center justify-center text-green-700 text-3xl font-bold'>{data?.name?.charAt(0)}</span>}
                    </div>
                    <p className='text-gray-800 font-medium text-lg'>{data?.name}</p>
                </div>
                <div className='flex flex-col items-start gap-3 text-green-800 font-medium'>
                    <button onClick={()=>setActiveTab('personal')} 
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${activeTab === 'personal' 
                        ? 'bg-green-200 shadow-md'
                        : 'bg-green-50 hover:bg-green-200'
                    }`}>Personal Information</button>
                    <div onClick={()=>setActiveTab('reset-password')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${activeTab === 'reset-password' 
                        ? 'bg-green-200 shadow-md'
                        : 'bg-green-50 hover:bg-green-200'
                        }`}>Reset Password</div>
                    <button className='text-red-500 font-medium w-full rounded-lg px-4 py-2 cursor-pointer text-start' onClick={()=>signOut({callbackUrl:'/login'})}>Log Out</button>
                </div>
            </div>

            
            <div className='w-full md:w-2/3 p-4 bg-white md:p-8 rounded-2xl shadow-sm border border-gray-100'>
                <div className='md:hidden flex gap-6 mb-6 border-b pb-2'>
                    <button onClick={()=>setActiveTab('personal')} className={`text-sm font-bold ${activeTab==='personal'
                        ? 'text-green-700 border-b-2 border-green-700'
                        : 'text-gray-400'
                        }`}>Personal</button>
                    <button onClick={()=>setActiveTab('reset-password')} className={`text-sm font-bold ${activeTab==='reset-password'
                        ? 'text-green-700 border-b-2 border-green-700'
                        : 'text-gray-400'
                        }`}>Reset Password</button>
                </div>
                {activeTab ==='personal' ? <PersonalInfo />:<PasswordReset />}
            </div>
        </div>
    </div>
  )
}

export default Profile
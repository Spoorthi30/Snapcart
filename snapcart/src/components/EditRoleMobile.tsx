'use client'

import { ArrowRight, Bike, User, UserCog } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from "motion/react"
import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const EditRoleMobile = () => {
    
    const [roles, setRoles] = useState([
        {id:"admin",label : "Admin",icon:UserCog},
        {id:"user",label : "User",icon:User},
        {id:"deliveryBoy",label : "Delivery Boy",icon:Bike}
    ])
    const [mobileNo, setMobileNo] = useState('')

    const [selectedRole, setSelectedRole] = useState('')

    const router = useRouter()

    const {update} = useSession()

    const handleEdit = async() => {
        try {
            const result = await axios.post('/api/user/edit-mobile',{
            role : selectedRole,
            mobile : mobileNo
        })
        await update({role:selectedRole})
        router.push("/")
        } catch (error) {
         console.log(error)   
        }
    }

    useEffect(()=>{
        const checkForAdmin = async() => {
            try {
                const result = await axios.get('/api/check-for-admin')
                if(result.data.adminExist){
                    setRoles(prev=>prev.filter(role=>role.id!=="admin"))
                }
            } catch (error) {
                console.log(error)
            }
        }
        checkForAdmin()
    },[])

  return (
    <div className='flex flex-col items-center min-h-screen w-full p-6 gap-12'>
        <h2 className='text-3xl font-bold text-green-700'>Select Your Role</h2>
        <div className='flex flex-col md:flex-row justify-center items-center gap-10'>
                {roles.map((role)=>{
                    const Icon = role.icon
                    const isSelected = selectedRole == role.id
                    return (
                        <motion.div 
                        whileTap={{scale : 0.9}}
                        onClick={()=>setSelectedRole(role.id)}
                        key={role.id} className={`h-28 w-28 border-2 rounded-xl text-sm font-medium flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                             ? "border-green-600 bg-green-100 shadow-lg"
                             : "border-gray-300 bg-white hover:border-green-400"
                            }`}>
                            <Icon size={18}/>
                            {role.label}
                        </motion.div>
                    )
                })}
        </div>
        <div className='flex flex-col items-center mt-10'>
            <label htmlFor='mobile' className='font-medium mb-3'>Enter your mobile number</label>
            <input type='tel' 
            placeholder='eg. 0000000000' 
            className='w-64 md:w-80 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800'
            value={mobileNo}
            onChange={(e)=>setMobileNo(e.target.value)}
            />
        </div>
        <button disabled={mobileNo.length!==10 || !selectedRole}
        className={`flex items-center gap-4 px-4 py-2 rounded-lg font-medium
            ${selectedRole && mobileNo.length === 10 
                ? 'bg-green-600 cursor-pointer text-white'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }
        `}
        onClick={handleEdit}
        >
            Go to Home 
            <ArrowRight size={18}/>
        </button>
    </div>
  )
}

export default EditRoleMobile
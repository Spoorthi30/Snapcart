'use client'

import axios from 'axios'
import { ArrowLeft, Loader, PlusCircle, Upload } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const categories = [
            "Fruits & Vegetable",
            "Dairy & Eggs",
            "Rice , Atta & Grains",
            "Snacks & Biscuit",
            "Spices & Masala",
            "Beverages & Drinks",
            "Personal Care",
            "Household Essentials",
            "Tnstance & Packed Food",
            "Baby & Pet Care"
]

const units = ['kg','g','litre','ml','piece','pack']

const AddGrocery = () => {
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [unit, setUnit] = useState("")
    const [price, setPrice] = useState("")
    const [preview, setpreview] = useState<string | null>()
    const [backendImage, setBackendImage] = useState<File | null>()
    const [loading, setLoading] = useState(false)

    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e:ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files 
        if(!files || files.length == 0)return 
        const file = files[0]
        setBackendImage(file)
        setpreview(URL.createObjectURL(file))
    }

    const handleSubmit = async(e:FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name",name)
            formData.append("category",category)
            formData.append("unit",unit)
            formData.append("price",price)
            if(backendImage){
                formData.append("image",backendImage)
            }
            
            const result = await axios.post('/api/admin/add-grocery',formData)
            toast.success("Item added successfully")
            console.log(result.data)
            setName('');
            setCategory(''); 
            setUnit('');
            setPrice('');
            setBackendImage(null);

            setpreview(null);

            if (imageInputRef.current) {
                imageInputRef.current.value = ""; 
            }

            setLoading(false)
            
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
            setLoading(false)
        }
    }

  return (
    <div className='relative w-full min-h-screen flex items-center justify-center'>
        <Link href="/" className='absolute top-6 left-6 bg-white flex items-center gap-2 px-4 py-2 rounded-full text-green-700 font-medium'>  
            <ArrowLeft className='w-6 h-6'/>
            <span className='hidden md:flex'>Go To Home</span>
        </Link>
        <div className='w-full max-w-2xl bg-white shadow-lg p-8 border border-green-100 rounded-2xl flex flex-col items-center'>
            <div className='flex items-center gap-2 font-bold text-xl'>
                <PlusCircle className='w-5 h-5 text-green-800'/>
                <h3>Add your grocery</h3>
            </div>
            <p className='text-sm mt-2 text-green-800 font-medium'>Fill out the following details to add new grocery items</p>
            <form className='mt-6 w-full flex flex-col gap-4' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='name' className='text-gray-700 font-semibold mb-1'>Grocery Name<span className='text-red-500 ml-1'>*</span></label>
                    <input type='text' id='name' placeholder='ex. sweets , milk' className='w-full border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800'
                    value={name} onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div className=''>
                        <label htmlFor='category' className='text-gray-700 font-semibold mb-1'>Category<span className='text-red-500 ml-1'>*</span></label>
                        <select name="category" className='w-full border border-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-green-400 px-3 py-2 transition-all'
                        value={category} onChange={(e)=>setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category,i)=>(
                                <option key={i} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className=''>
                        <label htmlFor='unit' className='text-gray-700 font-semibold mb-1'>Unit<span className='text-red-500 ml-1'>*</span></label>
                        <select name="units" className='w-full border border-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-green-400 px-3 py-2 transition-all'
                        value={unit} onChange={(e)=>setUnit(e.target.value)}
                        >
                            <option value="">Select Unit</option>
                            {units.map((unit)=>(
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor='price' className='text-gray-700 font-semibold '>Price<span className='text-red-500 ml-1'>*</span></label>
                    <input type='text' placeholder='ex. 120' value={price} onChange={(e)=>setPrice(e.target.value)} className='w-full border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500    text-gray-800'
                    />
                </div>
                <div className='flex flex-col sm:flex-row items-center gap-2'>
                    <label htmlFor='image' className='flex items-center justify-center gap-2 bg-green-50 text-green-700 cursor-pointer  font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-blue-500 hover:text-white transition-all w-full sm:w-auto'>
                        <Upload className='w-5 h-5'/>Upload</label>
                    <input type='file' id='image' ref={imageInputRef} accept='image/*' hidden onChange={handleImageChange}/>
                    {preview && <Image src={preview} width={100} height={100} className='rounded-xl border border-gray-200 object-cover mt-0.5' alt='image'/>}
                </div>
                <button disabled={loading} className='w-full bg-linear-to-r from-green-500 to-green-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-60 mt-4 transition-all cursor-pointer font-semibold flex items-center justify-center gap-2'>
                    {loading ? <Loader className='w-5 h-5 animate-spin'/> : 'Add Grocery'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default AddGrocery
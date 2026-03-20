'use client'

import { IGrocery } from '@/components/GroceryItemCard'
import axios from 'axios'
import { ArrowLeft, Loader, Package, Pencil, Search, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
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

const ViewGrocery = () => {

    const router = useRouter()
    const [groceries, setGroceries] = useState<IGrocery[]>()
    const [editing, setEditing] = useState<IGrocery | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [backendImage, setBackendImage] = useState<Blob | null>(null)
    const [editLoading, setEditLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<IGrocery[]>()

    useEffect(()=>{
        const getGroceries = async() => {
            try {
                const result = await axios.get('/api/admin/get-groceries')
                // console.log(result.data)
                setGroceries(result.data)
                setFilter(result.data)
            } catch (error) {
                console.log(error)
            }

        }
        getGroceries()
    },[])

    useEffect(()=>{
        if(editing){
            setImagePreview(editing.image)
        }
    },[editing])

    const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0]
        if(file){
            setBackendImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleEdit = async() =>{
        setEditLoading(true)
        if(!editing || !editing._id) return
        try {
            const formData = new FormData()
            formData.append("groceryId",editing._id.toString())
            formData.append("name",editing.name)
            formData.append("category",editing.category)
            formData.append("unit",editing.unit)
            formData.append("price",editing.price)
            if(backendImage){
                formData.append("image",backendImage)
            }
            const result = await axios.post('/api/admin/edit-grocery',formData)
            setGroceries((prev) => 
                prev?.map((item) => item._id === editing._id ? result.data : item)
            );
            toast.success('Item edited successfully')
            setEditing(null);
            setEditLoading(false)
            // window.location.reload()
        } catch (error) {
            setEditLoading(false)
            toast.error('Something went wrong')
            console.log(error)
        }
    }

    const deleteItem = async()=>{
        setDeleteLoading(true)
        if(!editing || !editing?._id) return

        try {
            const result = await axios.delete('/api/admin/delete-grocery',{data:{groceryId:editing?._id}})
            toast.success('Item deleted successfully')
            setGroceries((prev) => prev?.filter((item) => item._id !== editing._id));
            setEditing(null);
            setDeleteLoading(false)
            // window.location.reload()
        } catch (error) {
            setDeleteLoading(false)
            toast.error('Something went wrong')
            console.log(error)
        }
    }

    const handleSubmit = async(e:React.FormEvent) =>{
        e.preventDefault()
        // const query = search.toLowerCase()

        // setFilter(
        //     groceries?.filter((grocery)=>grocery.name.toLowerCase().includes(query) || grocery.category.toLowerCase().includes(query))
        // )
    }

    const displayGroceries = groceries?.filter((grocery) => 
    grocery.name.toLowerCase().includes(search.toLowerCase()) || 
    grocery.category.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className='pt-4 w-[95%] md:w-[85%] mx-auto pb-20'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left'>
            <button onClick={()=>router.back()}
                className='flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto'>
                <ArrowLeft size={18}/><span>Back</span>
            </button>
                <h1 className='text-green-700 text-2xl md:text-3xl font-extrabold flex items-center justify-center gap-2'><Package size={21} className='text-green-600'/>Manage Grocery</h1>
        </div>

        <form className='flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg w-full mx-auto' onSubmit={handleSubmit}>
            <Search className='text-gray-500 h-5 w-5 mr-2'/>
            <input type='text' className='w-full outline-none text-gray-700 placeholder-gray-400' placeholder='Search by name or category...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </form>

        <div className='space-y-4'>
            {displayGroceries?.map((grocery,index)=>(
                <motion.div key={index}
                whileHover={{scale:1.01}}
                transition={{type:'spring' , stiffness:100}}
                className='bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all'>
                    <div className='relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200'>
                        <Image src={grocery.image} alt={grocery.name} fill className='object-cover hover:scale-100 transition-transform duration-500'/>
                    </div>

                    <div className='flex-1 flex flex-col w-full justify-between'>
                        <div>
                            <h3 className='font-semibold text-lg text-gray-800 truncate'>{grocery.name}</h3>
                            <p className='text-gray-500 capitalize text-sm'>{grocery.category}</p>
                        </div>
                        <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                            <p className='text-green-700 font-bold text-lg'>{grocery.price}/<span className='text-gray-700 font-medium text-sm ml-1'>{grocery.unit}</span></p>
                            <button className='bg-green-600 text-white px-4 py-2 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all' onClick={()=>setEditing(grocery)}>
                                <Pencil />Edit
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* <AnimatePresence>
            {editing && (
                <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4'
                >
                    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative'>
                        <div className='flex justify-between items-center mb-4'>
                           <h2 className='text-2xl font-bold text-green-700'>Edit Grocery</h2>
                           < button className='text-gray-600 hover:text-red-600' onClick={()=>setEditing(null)}>
                            <X size={18}/>
                           </button>
                        </div>

                        <div className='relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group'>
                            {imagePreview && <Image 
                            src={imagePreview}
                            alt={editing.name}
                            fill
                            className='object-cover'
                            />}
                        </div>

                        <div className='space-y-4'>
                            <input 
                            type='text'
                            placeholder='Enter Grocry Name'
                            value={editing.name}
                            onChange={(e)=>setEditing({...editing,name:e.target.value})}
                            className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                            />

                            <select className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                            value={editing.category}
                            onChange={(e)=>setEditing({...editing,category:e.target.value})}
                            >
                                <option>Select Category</option>
                                {categories.map((category,i)=>(
                                    <option key={i} value={category}>{category}</option>
                                ))}
                            </select>

                            <select className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                            value={editing.unit}
                            onChange={(e)=>setEditing({...editing,unit:e.target.value})}
                            >
                                <option>Select Unit</option>
                                {units.map((unit,i)=>(
                                    <option key={i} value={unit}>{unit}</option>
                                ))}
                            </select>
                            
                            <input 
                            type='text'
                            placeholder='Enter Price'
                            value={editing.price}
                            onChange={(e)=>setEditing({...editing,price:e.target.value})}
                            className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                            />

                        </div>

                        <div className='flex justify-end gap-3 mt-6'>
                            <button className='px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all'>Edit Grocery</button>
                            <button className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition'>Delete Grocery</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence> */}

        <AnimatePresence>
        {editing && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
            >
            {/* Reduced max-width and padding for a tighter look */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 relative">
                <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-green-700">Edit Grocery</h2>
                <button className="text-gray-600 hover:text-red-600 transition" onClick={() => setEditing(null)}>
                    <X size={20} />
                </button>
                </div>

                {/* Changed from aspect-square to a fixed shorter height */}
                <div className="relative h-32 w-full rounded-lg overflow-hidden mb-4 border border-gray-200">
                {imagePreview && (
                    <Image 
                    src={imagePreview}
                    alt={editing.name}
                    fill
                    className="object-contain p-2" 
                    />
                )}
                <label htmlFor='imageUpload' className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity'><Upload size={20} className='text-green-500'/></label>
                <input type='file' hidden accept='image/*' id='imageUpload' onChange={handleImageUpload}/>
                </div>

                <div className="space-y-3">
                {/* Name Input */}
                <input 
                    type="text"
                    placeholder="Grocery Name"
                    value={editing.name}
                    onChange={(e) => setEditing({...editing, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />

                {/* Category Select */}
                <select 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    value={editing.category}
                    onChange={(e) => setEditing({...editing, category: e.target.value})}
                >
                    <option>Select Category</option>
                    {categories.map((category, i) => (
                    <option key={i} value={category}>{category}</option>
                    ))}
                </select>

                {/* Grid for Price and Unit to save vertical space */}
                <div className="grid grid-cols-2 gap-3">
                    <input 
                    type="text"
                    placeholder="Price"
                    value={editing.price}
                    onChange={(e) => setEditing({...editing, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <select 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    value={editing.unit}
                    onChange={(e) => setEditing({...editing, unit: e.target.value})}
                    >
                    <option>Unit</option>
                    {units.map((unit, i) => (
                        <option key={i} value={unit}>{unit}</option>
                    ))}
                    </select>
                </div>
                </div>

                {/* Compact Footer Buttons */}
                <div className="flex gap-2 mt-5">
                <button className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center text-center"
                onClick={handleEdit}
                disabled={editLoading}
                >
                    {editLoading?<Loader size={14}/>: "Update"}
                </button>
                <button className="flex-1 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 transition flex items-center justify-center text-center"
                onClick={deleteItem}
                disabled={deleteLoading}>
                     {deleteLoading?<Loader size={14}/>: "Delete"}
                </button>
                </div>
            </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  )
}

export default ViewGrocery
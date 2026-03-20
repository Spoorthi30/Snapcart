"use client";
 
/* eslint-disable */
import { RootState } from "@/redux/store";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { setUserData } from "@/redux/userSlice";
 
// const PersonalInfo = ({data}:{data:IUser | null}) => {
const PersonalInfo = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    email :""
  });
  const [preview, setPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const dispatch = useDispatch()
  const {update} = useSession()
 
 
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        name: userData.name || "",
        mobile: userData.mobile || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file){
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }
 
  // const handleSubmit = async(e:React.FormEvent) =>{
  //   e.preventDefault()
  //   setLoading(true)
  //   try {
  //     const result = await axios.patch('/api/profile/update-profile',address)
  //     setAddress(result.data)
  //     toast.success('Profile has been updated successfully')
  //     setLoading(false)
  //   } catch (error) {
  //     setLoading(false)
  //     toast.error('Something went wrong')
  //     console.log(error)
  //   }
  // }

  const handleSubmit = async(e:React.FormEvent) =>{
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name',address.name)
      formData.append('mobile',address.mobile)
      formData.append('email',address.email)

      if(imageFile){
        formData.append("image",imageFile)
      }

      const result = await axios.patch('/api/profile/update-profile',formData)
      if(result.status===200){
        dispatch(setUserData(result.data.updateProfile))

        await update({
          name: result.data.updateProfile.name,
          mobile: result.data.updateProfile.mobile,
          image: result.data.updateProfile.image,
      });

        toast.success(result.data.message);
        
        setPreview(null);
        setImageFile(null);
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Something went wrong')
      console.log(error)
    }
  }

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div className="flex items-center justify-around">
  //       <div className="relative mt-2" >
  //         <label htmlFor="name" className="text-gray-600 font-medium block">Name<span className="text-red-500">*</span></label>
  //         <input
  //           type="text"
  //           className="outline-none border border-gray-400 py-2 text-green-700 font-medium pl-2 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 "
  //           value={address.name}
  //           onChange={(e) =>
  //             setAddress((prev) => ({ ...prev, name: e.target.value }))
  //           }
  //         />
  //       </div>
  //       <div className="relative my-4">
  //         <label htmlFor="name" className="text-gray-600 font-medium block">Mobile<span className="text-red-500">*</span></label>
  //         <input
  //           type="tel"
  //           className="outline-none border border-gray-400 py-2 text-green-700 font-medium pl-2 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 "
  //           value={address.mobile}
  //           onChange={(e) =>
  //             setAddress((prev) => ({ ...prev, mobile: e.target.value }))
  //           }
  //         />
  //       </div>
  //     </div>
  //     <div className="flex items-center">
  //       <div className="relative my-4">
  //         <label htmlFor="name" className="text-gray-600 font-medium block">Email<span className="text-red-500">*</span></label>
  //         <input
  //           type="tel"
  //           className="outline-none border border-gray-400 py-2 text-green-700 font-medium pl-2 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 "
  //           value={address.email}
  //           onChange={(e) =>
  //             setAddress((prev) => ({ ...prev, email: e.target.value }))
  //           }
  //         />
  //       </div>
  //       <div></div>
  //     </div>
  //     <div className='text-center'>
  //           <button disabled={loading} type="submit" className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 cursor-pointer mt-4'>
  //             {loading ? <Loader className="w-5 h-5 animate-spin"/> : 'Save Changes '}
  //           </button>
  //   </div>
  //   </form>
  // );
 
 return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-green-400 flex items-center justify-center bg-green-50 overflow-hidden transition-all group-hover:border-green-600">
            {preview ? (
              <Image src={preview} fill className="w-full h-full object-cover rounded-full" alt="Preview" />
            ): userData?.image ?(
              <Image src={userData.image} fill className="w-full h-full object-cover rounded-full" alt="Profile" />
            ) : (
              <div className="w-full h-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold">
              {address.name.charAt(0)}
            </div>
            )}
          </div>
          <label 
                htmlFor="imageUpload" 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full cursor-pointer shadow-md hover:bg-green-700 transition-all whitespace-nowrap"
            >
                {preview ? "CHANGE PHOTO" : "UPLOAD PHOTO"}
                <input 
                    type="file" 
                    id="imageUpload" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageChange} 
                />
            </label>
        </div>
        <p className="text-[11px] text-gray-400 mt-4 italic">JPG, PNG or GIF (Max 2MB)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5" >
          <label htmlFor="name" className="text-gray-600 font-semibold text-sm">Name<span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full outline-none border border-gray-300 py-2 px-4 text-green-700 font-medium pl-2 pr-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={address.name}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mobile" className="text-gray-600 font-semibold text-sm">Mobile<span className="text-red-500">*</span></label>
          <input
            type="tel"
            className="w-full outline-none border border-gray-300 py-2 px-4 text-green-700 font-medium pl-2 pr-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={address.mobile}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, mobile: e.target.value }))
            }
          />
        </div>
 
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="email" className="text-gray-600 font-medium block">Email<span className="text-red-500">*</span></label>
          <input
            type="tel"
            className="w-full outline-none border border-gray-300 py-2 px-4 text-green-700 font-medium pl-2 pr-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={address.email}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
     
      </div>
      <div className='text-center'>
            <button disabled={loading} type="submit" className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 cursor-pointer mt-4'>
              {loading ? <Loader className="w-5 h-5 animate-spin"/> : 'Save Changes '}
            </button>
    </div>
    </form>
  );
 
};
 
export default PersonalInfo;
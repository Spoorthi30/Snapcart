'use client'

import { RootState } from '@/redux/store'
import { ArrowLeftCircle, CreditCard, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, SquareKanban, Truck, User } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('@/components/MapClient'), { ssr: false })


const CheckoutPage = () => {

  const {userData} = useSelector((state:RootState) => state.user)
  const {cartData,subTotal,deliveryFee,total} = useSelector((state:RootState) => state.cart)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const router = useRouter()

  const [address, setAddress] = useState({
    name : "",
    mobile : "",
    city : "",
    state : "",
    pincode : "",
    fullAddress : ""
  })

  // const [position, setPosition] = useState(null)
  const [position, setPosition] = useState<[number,number] | null>(null)

    useEffect(()=>{
    if(userData){
      setAddress((prev)=>({...prev,name:userData.name || "" , mobile:userData.mobile || ""}))
    }
  },[userData])

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((pos)=>{
        // console.log(pos)
        const {latitude,longitude,accuracy} = pos.coords
        console.log('📍 Browser raw coords:', latitude, longitude, 'accuracy:', accuracy, 'm')
        setPosition([latitude,longitude])
        // console.log(latitude,longitude)
      },(err)=>{
        console.warn("High accuracy failed:", err);
    // Fallback to less accurate, faster method
    navigator.geolocation.getCurrentPosition(
      (pos2) => {
        setPosition([pos2.coords.latitude, pos2.coords.longitude]);
      },
      (err2) => console.error("Fallback also failed:", err2),
      { enableHighAccuracy: false, timeout: 20000 }
    );
      },{enableHighAccuracy:true,maximumAge:0,timeout:30000})
    }
  },[])


  useEffect(() => {
    const fetchAddress = async() => {
      if(!position) return 
      try {
        const result = await axios.get(`/api/geocode?lat=${position[0]}&lon=${position[1]}`);
        // const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
        const addr = result.data.address;
        console.log(result.data)
        setAddress(prev => ({...prev , 
          city: addr.city || addr.town || addr.village || addr.suburb || addr.city_district || "",
          state : addr.state, 
          pincode : addr.postcode,
          fullAddress : result.data.display_name}))
      } catch (error) {
        console.log(error)
      }
    }
    fetchAddress()
  },[position])

//   useEffect(() => {
//   const fetchAddress = async () => {
//   if (!position) return;
//   try {
//     // Calling your working internal API
//     const response = await axios.get(`/api/geocode?lat=${position[0]}&lon=${position[1]}`);
//     const data = response.data;
//     const addr = data.address;

//     if (addr) {
//       setAddress(prev => ({
//         ...prev,
//         // Priority: city -> town -> village -> suburb
//         city: addr.city || addr.town || addr.village || addr.suburb || "",
//         state: addr.state || "",
//         pincode: addr.postcode || "",
//         fullAddress: data.display_name || ""
//       }));
//     }
//   } catch (error) {
//     console.error("Error fetching address on frontend:", error);
//   }
// };

//   fetchAddress();
// }, [position]); 

  const handleSearchQuery = async() => {
    setSearchLoading(true)
     const { OpenStreetMapProvider } = await import('leaflet-geosearch')
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if(!position) return 
    setPosition([results[0].y,results[0].x])
    setSearchLoading(false)
  }


  const handleCurrentLocation = async() => {
    
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((pos)=>{
        const {latitude,longitude} = pos.coords
        setPosition([latitude,longitude])
      },(err)=>{console.log('location error',err)},{enableHighAccuracy:true,maximumAge:0,timeout:10000})
    }
    setSearchQuery('')
  }

  const handleCod = async() => {
    if(!position) return null
    try {
      const result = await axios.post('/api/user/order-placed',{
        userID : userData?._id ,
        items : cartData.map((item)=>(
          {
            grocery : item._id,
            name : item.name,
            price : item.price,
            unit : item.unit,
            image : item.image,
            quantity : item.quantity
          }
        )),
        totalAmount : total,
        paymentMethod : "cod",
        address : {
          name : address.name,
          mobile : address.mobile,
          city : address.city,
          state : address.state,
          pincode : address.pincode,
          fullAddress : address.fullAddress,
          latitude : position[0],
          longitude : position[1]
        }
      })
      // console.log(result.data)
      router.push("/user/order-success")
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnlinePayment = async() => {
    if(!position) return null
    try {
      const result = await axios.post('/api/user/payment',{
        userID : userData?._id ,
        items : cartData.map((item)=>(
          {
            grocery : item._id,
            name : item.name,
            price : item.price,
            unit : item.unit,
            image : item.image,
            quantity : item.quantity
          }
        )),
        totalAmount : total,
        paymentMethod : "online",
        address : {
          name : address.name,
          mobile : address.mobile,
          city : address.city,
          state : address.state,
          pincode : address.pincode,
          fullAddress : address.fullAddress,
          latitude : position[0],
          longitude : position[1]
        }
      })
      window.location.href = result.data.url
    } catch (error) {
      console.log(error)
    }
  }

  // return (
  //   <div className='w-[95%] sm:w-[90%] md:w-[85%] mx-auto mb-24 mt-8'>
  //       <Link href={"/user/cart"} className='flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-all'>
  //           <ArrowLeftCircle className='w-5 h-5'/>
  //           <span className='hidden sm:inline'>Back to Cart</span>
  //       </Link>
  //         <div>
  //           <h2 className='text-green-800 font-bold text-2xl md:text-3xl text-center'>Checkout</h2>
  //           <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
  //             <div className='bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-full h-fit rounded-2xl p-5 border border-gray-100'>


  //               <h3 className='flex items-center gap-1 font-semibold'><MapPin className='text-green-600 w-5 h-5'/>Delivery Address</h3>
  //               <div>
  //                 <div className='relative mt-2'>
  //                   <User className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
  //                   <input type='text' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
  //                   value={address.name}
  //                   onChange={(e)=>setAddress((prev)=>({...prev,name:e.target.value}))}
  //                   />
  //                 </div>
  //                 <div className='relative my-4'>
  //                   <Phone className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
  //                   <input type='tel' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
  //                   value={address.mobile}
  //                   // onChange={(e)=>setAddress({...address,mobile:e.target.value})}
  //                   // onChange={(e)=>setAddress((prev)=>({...prev,mobile:address.mobile}))}
  //                   onChange={(e)=>setAddress((prev)=>({...prev,mobile:e.target.value}))}
  //                   />
  //                 </div>
  //                 <div className='relative my-4'>
  //                   <Home className='absolute top-2 left-2  w-5 h-5 text-green-600'/>
  //                  <textarea className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 resize-none' rows={2} value={address.fullAddress}
  //                  onChange={(e)=>setAddress((prev)=>({...prev,fullAddress:e.target.value}))}
  //                  placeholder='Enter your full address'
  //                  ></textarea>
  //                 </div>
  //                 <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
  //                   <div className='relative'>
  //                     <SquareKanban className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
  //                     <input type='text' placeholder='City' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
  //                     value={address.city}
  //                     onChange={(e)=>setAddress((prev)=>({...prev,city:e.target.value}))}
  //                     />
  //                   </div>
  //                   <div className='relative'>
  //                     <Navigation className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
  //                     <input type='text' placeholder='State' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
  //                     value={address.state}
  //                     onChange={(e)=>setAddress((prev)=>({...prev,state:e.target.value}))}
  //                     />
  //                   </div>
  //                   <div className='relative'>
  //                     <Search className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
  //                     <input type='text' placeholder='Pin' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
  //                     value={address.pincode}
  //                     onChange={(e)=>setAddress((prev)=>({...prev,pincode:e.target.value}))}
  //                     />
  //                   </div>
  //                 </div>
  //                 <div className='my-4 flex items-center gap-2'>
  //                   <input type='text' placeholder='Search City or Area..' className='outline-none border border-gray-400 w-full py-2 pl-2 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 ' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
  //                   <button onClick={handleSearchQuery} className='text-white bg-green-600 px-8 py-2 rounded-xl hover:bg-green-700 cursor-pointer transition-all duration-300'>
  //                     {searchLoading ? <Loader2 className='animate-spin'/> : 'Search'}
  //                   </button>
  //                 </div>
  //                 <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
  //                   {position && (
  //                     <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
  //                       <MapClient position={position} setPosition={setPosition} />
  //                       <motion.button
  //                         whileTap={{ scale: 0.93 }}
  //                         className="absolute bottom-4 right-4 z-999 bg-green-600 p-2 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-300"
  //                         onClick={handleCurrentLocation}
  //                       >
  //                         <LocateFixed size={20} />
  //                       </motion.button>
  //                     </div>
  //                   )}
  //                   <motion.button 
  //                   whileTap={{scale:0.93}}
  //                   className='absolute bottom-4 right-4 z-999 bg-green-600 p-2 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-300'
  //                   onClick={handleCurrentLocation}
  //                   >
  //                     <LocateFixed size={20}/>
  //                   </motion.button>
  //                 </div>
  //               </div>
  //             </div>


  //             <div className='bg-white shadow-lg w-full h-fit rounded-2xl p-5'>
  //               <h3 className='flex items-center gap-1 font-semibold'><CreditCard className='text-green-600 w-5 h-5'/>Payment Method</h3>
  //               <div className='space-y-4 mb-6 mt-2'>
  //                   <button
  //                   onClick={()=>setPaymentMethod('online')}
  //                   className={`border flex items-center gap-3 rounded-lg w-full p-2 transition-all 
  //                     ${ paymentMethod === 'online' 
  //                      ? 'border-green-600 bg-green-100 shadow-sm'
  //                      : 'hover:bg-gray-50'
  //                      }
  //                     `}>
  //                     <CreditCard /><span className='font-medium text-gray-700'>Pay Online(Stripe)</span>
  //                   </button>
  //                 <button
  //                 onClick={()=>setPaymentMethod('cod')}
  //                 className={`border flex items-center gap-3 rounded-lg w-full p-2 transition-all 
  //                     ${ paymentMethod === 'cod' 
  //                      ? 'border-green-600 bg-green-100 shadow-sm'
  //                      : 'hover:bg-gray-50'
  //                      }
  //                     `}>
  //                     <Truck /><span className='font-medium text-gray-700'>Cash on Delivery</span>
  //                   </button>
  //                 <hr className='text-gray-400 border'/>
  //                 <div className='flex flex-col gap-2 my-1'>
  //                   <div className='flex items-center justify-between pr-1 text-gray-500 text-sm font-medium'>
  //                     <span>Subtotal</span>
  //                     <span>₹{subTotal}</span>
  //                   </div>
  //                   <div className='flex items-center justify-between pr-1 text-gray-500 text-sm font-medium'>
  //                     <span>Delivery Fee</span>
  //                     <span>{deliveryFee}</span>
  //                   </div>
  //                 </div>
  //                 <hr className='text-gray-400 border'/>
  //                 <div className='flex items-center justify-between font-semibold mt-2'>
  //                     <span>Total</span>
  //                     <span>₹{total}</span>
  //                 </div>
  //                 <motion.button
  //                 whileTap={{scale:0.6}}
  //                 className='text-white bg-green-600 cursor-pointer hover:bg-green-700 transition-all duration-200 w-full rounded-full py-1 mt-2'
  //                 onClick={() => {
  //                   if(paymentMethod == 'cod'){
  //                     handleCod()
  //                   }else{
  //                     handleOnlinePayment()
  //                   }
  //                 }}
  //                 >
  //                   {paymentMethod==='cod' ? 'Place order' : 'Pay and Place Order'}
  //                 </motion.button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //   </div>
  // )

  return (
    <div className='w-[95%] sm:w-[90%] md:w-[85%] mx-auto mb-24 mt-8'>
        <Link href={"/user/cart"} className='flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-all'>
            <ArrowLeftCircle className='w-5 h-5'/>
            <span className='hidden sm:inline'>Back to Cart</span>
        </Link>
          <div>
            <h2 className='text-green-800 font-bold text-2xl md:text-3xl text-center'>Checkout</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
              <div className='bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-full h-fit rounded-2xl p-5 border border-gray-100'>


                <h3 className='flex items-center gap-1 font-semibold'><MapPin className='text-green-600 w-5 h-5'/>Delivery Address</h3>
                <div>
                  <div className='relative mt-2'>
                    <User className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
                    <input type='text' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
                    value={address.name}
                    onChange={(e)=>setAddress((prev)=>({...prev,name:e.target.value}))}
                    />.
                  </div>
                  <div className='relative my-4'>
                    <Phone className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
                    <input type='tel' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
                    value={address.mobile}
                    // onChange={(e)=>setAddress({...address,mobile:e.target.value})}
                    // onChange={(e)=>setAddress((prev)=>({...prev,mobile:address.mobile}))}
                    onChange={(e)=>setAddress((prev)=>({...prev,mobile:e.target.value}))}
                    />
                  </div>
                  <div className='relative my-4'>
                    <Home className='absolute top-2 left-2  w-5 h-5 text-green-600'/>
                   <textarea className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 resize-none' rows={2} value={address.fullAddress}
                   onChange={(e)=>setAddress((prev)=>({...prev,fullAddress:e.target.value}))}
                   placeholder='Enter your full address'
                   ></textarea>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <div className='relative'>
                      <SquareKanban className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
                      <input type='text' placeholder='City' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
                      value={address.city}
                      onChange={(e)=>setAddress((prev)=>({...prev,city:e.target.value}))}
                      />
                    </div>
                    <div className='relative'>
                      <Navigation className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
                      <input type='text' placeholder='State' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
                      value={address.state}
                      onChange={(e)=>setAddress((prev)=>({...prev,state:e.target.value}))}
                      />
                    </div>
                    <div className='relative'>
                      <Search className='absolute top-1/2 -translate-y-1/2 left-2  w-5 h-5 text-green-600'/>
                      <input type='text' placeholder='Pin' className='outline-none border border-gray-400 w-full py-2 pl-8 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 '
                      value={address.pincode}
                      onChange={(e)=>setAddress((prev)=>({...prev,pincode:e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className='my-4 flex items-center gap-2'>
                    <input type='text' placeholder='Search City or Area..' className='outline-none border border-gray-400 w-full py-2 pl-2 pr-2 rounded-lg focus:ring-1 focus:ring-gray-700 ' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                    <button onClick={handleSearchQuery} className='text-white bg-green-600 px-8 py-2 rounded-xl hover:bg-green-700 cursor-pointer transition-all duration-300'>
                      {searchLoading ? <Loader2 className='animate-spin'/> : 'Search'}
                    </button>
                  </div>
                  <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
                    {position && (
                      <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                        <MapClient position={position} setPosition={setPosition} />
                        <motion.button
                          whileTap={{ scale: 0.93 }}
                          className="absolute bottom-4 right-4 z-999 bg-green-600 p-2 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-300"
                          onClick={handleCurrentLocation}
                        >
                          <LocateFixed size={20} />
                        </motion.button>
                      </div>
                    )}
                    <motion.button 
                    whileTap={{scale:0.93}}
                    className='absolute bottom-4 right-4 z-999 bg-green-600 p-2 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-300'
                    onClick={handleCurrentLocation}
                    >
                      <LocateFixed size={20}/>
                    </motion.button>
                  </div>
                </div>
              </div>


              <div className='bg-white shadow-lg w-full h-fit rounded-2xl p-5'>
                <h3 className='flex items-center gap-1 font-semibold'><CreditCard className='text-green-600 w-5 h-5'/>Payment Method</h3>
                <div className='space-y-4 mb-6 mt-2'>
                    <button
                    onClick={()=>setPaymentMethod('online')}
                    className={`border flex items-center gap-3 rounded-lg w-full p-2 transition-all 
                      ${ paymentMethod === 'online' 
                       ? 'border-green-600 bg-green-100 shadow-sm'
                       : 'hover:bg-gray-50'
                       }
                      `}>
                      <CreditCard /><span className='font-medium text-gray-700'>Pay Online(Stripe)</span>
                    </button>
                  <button
                  onClick={()=>setPaymentMethod('cod')}
                  className={`border flex items-center gap-3 rounded-lg w-full p-2 transition-all 
                      ${ paymentMethod === 'cod' 
                       ? 'border-green-600 bg-green-100 shadow-sm'
                       : 'hover:bg-gray-50'
                       }
                      `}>
                      <Truck /><span className='font-medium text-gray-700'>Cash on Delivery</span>
                    </button>
                  <hr className='text-gray-400 border'/>
                  <div className='flex flex-col gap-2 my-1'>
                    <div className='flex items-center justify-between pr-1 text-gray-500 text-sm font-medium'>
                      <span>Subtotal</span>
                      <span>₹{subTotal}</span>
                    </div>
                    <div className='flex items-center justify-between pr-1 text-gray-500 text-sm font-medium'>
                      <span>Delivery Fee</span>
                      <span>{deliveryFee}</span>
                    </div>
                  </div>
                  <hr className='text-gray-400 border'/>
                  <div className='flex items-center justify-between font-semibold mt-2'>
                      <span>Total</span>
                      <span>₹{total}</span>
                  </div>
                  <motion.button
                  whileTap={{scale:0.6}}
                  className='text-white bg-green-600 cursor-pointer hover:bg-green-700 transition-all duration-200 w-full rounded-full py-1 mt-2'
                  onClick={() => {
                    if(paymentMethod == 'cod'){
                      handleCod()
                    }else{
                      handleOnlinePayment()
                    }
                  }}
                  >
                    {paymentMethod==='cod' ? 'Place order' : 'Pay and Place Order'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}

export default CheckoutPage
/* eslint-disable */

'use client'

import { getSocket } from "@/lib/socket"
import { RootState } from "@/redux/store"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import LiveMap from "./LiveMap"
import DeliveryBoyChat from "./DeliveryBoyChat"
import { Loader } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import toast from "react-hot-toast"

export interface ILocation{
    latitude : number,
    longitude : number
}


const DeliveryBoy = ({earning}:{earning:number}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [assignments, setAssignments] = useState<any[]>([])
    const [activeOrder, setActiveOrder] = useState<any>(null)
    const [userLocation, setUserLocation] = useState<ILocation>(
        {
            longitude : 0,
            latitude : 0
        }
    )
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>(
        {
            longitude : 0,
            latitude : 0
        }
    )
    const {userData} = useSelector((state:RootState) => state.user)
    const [showOtpBox, setShowOtpBox] = useState(false)
    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState("")
    const [sendOtpLoading, setSendOtpLoading] = useState(false)
    const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

    const getAssignments = async() => {
            try {
                const result = await axios.get('/api/delivery/get-assignments')
                // console.log(result.data)
                setAssignments(result.data)
            } catch (error:any) {
                console.log(error)
            }
        }

    const fetchCurrentOrder = async() => {
        try {
            const result = await axios.get('/api/delivery/current-order')
            if(result.data.active){
                // console.log(result.data.assignment.order.address)
                setActiveOrder(result.data.assignment)
                setUserLocation({
                    latitude:result.data.assignment.order.address.latitude,
                    longitude:result.data.assignment.order.address.longitude,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() : any=>{
        const socket = getSocket();
        socket.on("update-deliveryBoy-location",({userId,location})=>{
            setDeliveryBoyLocation({
                latitude:location.coordinates[1],
                longitude:location.coordinates[0],
            })
        })

        return () => socket.off("update-deliveryBoy-location")

    },[])

    useEffect(()=>{
        getAssignments()
        fetchCurrentOrder()
    },[userData])

    useEffect(()=>{
        const socket = getSocket()
        if(!userData?._id) return
        if(!navigator.geolocation) return
        const watcher = navigator.geolocation.watchPosition((pos)=>{
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude

            setDeliveryBoyLocation({
                latitude:lat,
                longitude:lng
            })

            socket.emit("update-location",{
                userId : userData._id,
                latitude : lat,
                longitude : lng
            })
        },(err)=>{
            console.log(err)
        },{enableHighAccuracy:true})
        return () => navigator.geolocation.clearWatch(watcher)

    },[userData?._id])

    // useEffect(() : any=>{
    //     const socket = getSocket()
    //     socket.on("new-assignment",(deliveryAssignment)=>{
    //         setAssignments(prev => [...prev,deliveryAssignment])
    //     })
    //     return () => socket.off('new-assignment')
    // },[])

    useEffect(() : any => {
    const socket = getSocket();
    
    socket.on("new-assignment", (deliveryAssignment) => {
        setAssignments(prev => {
            const isDuplicate = prev.some(attr => attr._id === deliveryAssignment._id);
            
            if (isDuplicate) {
                return prev; 
            }
            
            return [...prev, deliveryAssignment];
        });
    });

    socket.on("remove-assignment",(data)=>{
        setAssignments((prev) => prev.filter((assignment)=>assignment._id !==data.assignmentId))
    })

    return () => {
        socket.off('new-assignment');
        socket.off('remove-assignment');
    }
}, []);

    const handleAccept = async(id : string) => {
        try {
            const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
            // console.log(result)
            // console.log(id)
            fetchCurrentOrder()
        } catch (error) {
            console.log(error)
        }
    }

    const handleReject = async(id:string) => {
        try {
            const result = await axios.patch(`/api/delivery/assignment/${id}/reject`)
            setAssignments((prev) => prev.filter(item => item._id !== id));
            toast.success('Order dissmissed')
        } catch (error) {
            console.log(error)
            toast.error("Failed to reject order");
        }
    }

    const sendOtp = async() =>{
        setSendOtpLoading(true)
        try {
            const result = await axios.post('/api/delivery/otp/send',{orderId:activeOrder.order._id})
            console.log(result.data)
            toast.success(`OTP has been sent to ${userData?.email}.Kindly check.`)
            setShowOtpBox(true)
            setSendOtpLoading(false)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
            setSendOtpLoading(false)
        }
    }

    const verifyOtp = async() =>{
        setVerifyOtpLoading(true)
        setOtpError("");
        try {
            const result = await axios.post('/api/delivery/otp/verify',{orderId:activeOrder.order._id,otp:otp})
            console.log(result.data)
            toast.success('OTP verified successfully')
            setActiveOrder(null)
            setOtp("");
            setShowOtpBox(false);
            // setAssignments(prev => prev.filter(a => a.order._id !== activeOrder.order._id));
            await getAssignments();
            setVerifyOtpLoading(false)
        } catch (error) {
            toast.error('Invalid OTP')
            setVerifyOtpLoading(false)
        }
    }

    const todaysEarning=[
        {
            name:"Today",
            earning,
            deliveries : earning/40
        }
    ]

    // if(!activeOrder && assignments.length===0){
    //     return(
    //         <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6">
    //             <div className="max-w-md w-full text-center">
    //                 <h2 className="text-2xl font-bold text-gray-800">No active deliveries 🚛</h2>
    //                 <p className="text-gray-500 mb-5">Stay online to recive new orders</p>

    //                 <div className="bg-white rounded-xl border shadow-xl p-6">
    //                     <h2 className="text-green-700 font-medium mb-2">Today's Performance</h2>
    //                     <ResponsiveContainer width="100%" height={300}>
    //                         <BarChart data={todaysEarning}>
    //                             <XAxis dataKey="name"/>
    //                             <YAxis />
    //                             <Tooltip />
    //                             <Legend />
    //                             <Bar dataKey="earnings" name="Earnings (₹)" />
    //                             <Bar dataKey="deliveries" name="Deliveries " />
    //                         </BarChart>
    //                     </ResponsiveContainer>

    //                     <p className="mt-4 text-lg font-bold text-green-700">{earning || 0 } Earned Today</p>
    //                     <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg" onClick={window.location.reload}>Refresh Earnings</button>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    if(activeOrder && userLocation){
        return (
            <div className="p-4 pt-[100px] min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto ">
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Active Assignment</h2>
                    <p className="text-sm text-gray-600 mb-4">order #{activeOrder.order._id.slice(-6)}</p>
                    <div className="border rounded-lg mb-6 b">
                        <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
                    </div>
                    <DeliveryBoyChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!}/>

                    <div className="mt-6 p-6 bg-white rounded-xl border shadow">
                        {!activeOrder.order.deliveryOtpVerify && !showOtpBox && (
                            <button onClick={sendOtp} className="w-full py-4 rounded-lg bg-green-600 text-white flex items-center justify-center gap-2 transition-all active:scale-95">
                                {sendOtpLoading ? <Loader size={16} className="animate-spin text-white "/> : "Mark as delivery"}
                            </button>
                        )}
                        {
                            showOtpBox &&
                            <div className="mt-4">
                                <input type="text" className="w-full py-3 border rounded-lg text-center" maxLength={4} placeholder="Enter otp" onChange={(e)=>setOtp(e.target.value)} value={otp}/>
                                <button className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95" onClick={verifyOtp}>
                                    {verifyOtpLoading ? <Loader size={16} className="animate-spin text-white text-center"/> : "Verify OTP"}
                                </button>
                                {otpError && <div className="mt-2 text-red-600">{otpError}</div>}
                            </div>
                        }   
                        {activeOrder.order.deliveryOtpVerify && <div className="text-green-700 font-bold text-center">Delivery Completed!!!</div>}                    
                    </div>
                </div>
            </div>
        )
    }

    if (assignments.length > 0) {
    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="font-bold mt-20 mb-4 text-2xl">New Delivery Assignments</h2>
                {assignments.map((assignment, index) => (
                    <div key={index} className="p-5 bg-white rounded-xl shadow-md mb-4">
                        <p><b>Order Id</b> #{assignment?.order._id.slice(-6)}</p>
                        <p className="text-gray-600">{assignment.order.address.fullAddress}</p>
                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={() => handleAccept(assignment._id)} 
                                className="flex-1 bg-green-600 text-white rounded-lg py-2"
                            >
                                Accept
                            </button>
                            <button onClick={()=>handleReject(assignment._id)} className="flex-1 bg-red-600 text-white rounded-lg py-2">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6">
        <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800">No active deliveries 🚛</h2>
            <p className="text-gray-500 mb-5">Stay online to receive new orders</p>
            <div className="bg-white rounded-xl border shadow-xl p-6">
                <h2 className="text-green-700 font-medium mb-2">Today's Performance</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={todaysEarning}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="earning" name="Earnings (₹)" fill="#16a34a" />
                        <Bar dataKey="deliveries" name="Deliveries" fill="#22c55e" />
                    </BarChart>
                </ResponsiveContainer>
                <p className="mt-4 text-lg font-bold text-green-700">{earning || 0} Earned Today</p>
            </div>
        </div>
    </div>
);
}

export default DeliveryBoy
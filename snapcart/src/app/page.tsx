import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveryBoyDashboard from '@/components/DeliveryBoyDashboard'
import EditRoleMobile from '@/components/EditRoleMobile'
import Footer from '@/components/footer'
import GeoUpdater from '@/components/GeoUpdater'
import { IGrocery } from '@/components/GroceryItemCard'
import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import connectDB from '@/lib/db'
import Grocery from '@/models.ts/grocery.model'
import User from '@/models.ts/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async(props : {
  searchParams : Promise<{
    q:string
  }>
}) => {

  const searchParams = await props.searchParams


  await connectDB()
  const session = await auth();
  // console.log(session)
  const user = await User.findById(session?.user?.id)
  if(!user){
    redirect("/login")
  }

  const inCompelte = !user.mobile || !user.role || (!user.mobile && user.role=='user')

  if(inCompelte){
    return <EditRoleMobile />
  }

  const plainText = JSON.parse(JSON.stringify(user))

  let groceryList:IGrocery[] = []

  if(user.role==='user'){
   const query = searchParams.q
    ? {
      $or : [
        {name : {$regex : searchParams.q , $options : "i"}},
        {category : {$regex : searchParams.q , $options : "i"}},
      ]
    } : {}

    const docs = await Grocery.find(query);
    groceryList = JSON.parse(JSON.stringify(docs))
  }

  return (
    <>
      <Nav user={plainText}/>
      <GeoUpdater userId={plainText._id}/>
      { user.role == 'user' ? (
        <UserDashboard groceryList={groceryList}/>
      ) : user.role == 'admin' ? (
        <AdminDashboard />
      ) : <DeliveryBoyDashboard />
      }
      <Footer />
    </>
  )
}

export default page
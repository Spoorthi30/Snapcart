import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import connectDB from '@/lib/db'
import Grocery from '@/models.ts/grocery.model'
import GroceryItemCard, { IGrocery } from './GroceryItemCard'

const UserDashboard = async({groceryList}:{groceryList:IGrocery[]}) => {
  await connectDB()

  // const groceries = await Grocery.find({})
  // const plainGrocery = JSON.parse(JSON.stringify(groceries))
  return (
    <>
        <HeroSection />
        <CategorySlider />
        <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
          <h2 className='text-2xl md:text-3xl text-green-700 font-bold text-center mb-6'>Popular Grocery Items</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6'>
              {/* {plainGrocery.map((item : IGrocery )=>(
                <GroceryItemCard item={item} key={item._id}/>
              ))} */}
              {groceryList.map((item : IGrocery )=>(
                <GroceryItemCard item={item} key={item._id}/>
              ))}
            </div>
        </div>
        
    </>
  )
}

export default UserDashboard
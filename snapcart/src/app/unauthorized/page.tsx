import React from 'react'

const Unauthorized = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-white gap-4'>
        <h2 className='text-5xl text-red-500 font-extrabold'>Access Denied🚫</h2>
        <p className='text-gray-800 text-lg'>You cannot accesss this page</p>
    </div>
  )
}

export default Unauthorized
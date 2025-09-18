import { Plus } from 'lucide-react'
import React from 'react'

const ProductDisplay = () => {
  return (
   <div>
     <div className="bg-white rounded-lg shadow p-6">ProductDisplay</div>

     <div className='flex justify-center items-center h-[70vh]'>
      <h3 className='text-2xl font-bold bg-[var(--two2m)] p-2 rounded-2xl cursor-pointer flex text-[var(--two5m)]'> <Plus/><span> Add Promotion</span> </h3>
     </div>
   </div>
  )
}

export default ProductDisplay
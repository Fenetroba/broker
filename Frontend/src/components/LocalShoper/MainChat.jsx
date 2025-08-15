import { Paperclip, Send } from 'lucide-react'
import React from 'react'

const MainChat = () => {
  return (
    <div>
     
     <div className='absolute w-full bottom-10  flex justify-center items-center' >
          <Paperclip className='bg-white h-10  '/>
          <input type="text" className='bg-white w-[80%] px-10    outline-0 shadow-lg h-10 mr' /> <Send className='w-20 cursor-pointer   bg-[var(--two3m)] h-10'/>
     </div>
    </div>
  )
}

export default MainChat
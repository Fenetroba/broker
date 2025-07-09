import React from 'react'
import { Outlet } from 'react-router-dom'

const LocalLayer = () => {
  return (
    <div>
     <Outlet/>
    </div>
  )
}

export default LocalLayer
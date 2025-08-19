import React from 'react'
import './Loading.css'
const PageLoad = () => {
  return (
    <div className='flex justify-center items-center m-0 h-screen '>

<div className="loader">
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__bar"></div>
  <div className="loader__ball"></div>
</div>
    </div>
  )
}

export default PageLoad
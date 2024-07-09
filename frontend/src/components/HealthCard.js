import React from 'react'
import acne from '../assets/Acne.webp'

const HealthCard = (props) => {
  return (
    <div className="flex flex-col items-center w-24">
    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
      <img src={acne}  className="w-24 h-24" />
    </div>
    <p className="text-center text-xs mb-2">{props.title} </p>
    <a href="#" className="text-blue-500 text-xs">{props.link}</a>
  </div>
  )
}

export default HealthCard
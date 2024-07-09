import React from 'react'
import check from '../assets/checking.avif'

const SliderCard = (props) => {
  return (
    <div className="p-4 ">
      <img src={check}  className="w-full h-40 object-cover rounded-lg mb-2" />
      <h3 className="text-lg font-semibold mb-1">{props.title}</h3>
      <p className="text-sm text-gray-600">{props.description}</p>
    </div>
  )
}

export default SliderCard
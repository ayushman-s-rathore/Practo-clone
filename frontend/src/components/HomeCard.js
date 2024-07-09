import React from 'react'
import doctor from '../assets/doctor.avif'

const HomeCard = (props) => {
    // console.log(props)
  return (
    <div className='flex flex-col  h-64 w-44 rounded-xl shadow-2xl'>
        <img src={doctor} className='rounded-t-xl'/>
        <p className='px-2 py-1'>{props.text1} </p>
        <p className='text-xs ml-2'>{props.text2} </p>
    </div>
  )
}

export default HomeCard
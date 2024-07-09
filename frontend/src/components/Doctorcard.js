import React from 'react'
import doc from '../assets/doctor.avif'
import { useNavigate } from 'react-router-dom'
import { BsCurrencyRupee } from 'react-icons/bs'
const Doctorcard = (props) => {
    const navigate=useNavigate()
    
  return (
    <div className='flex flex-row w-full my-6 rounded-lg shadow-xl border p-6'>
        <img src={doc} className='w-36 h-36 rounded-full' ></img>
        <div className='flex flex-col w-2/3 ml-4 cursor-pointer' onClick={()=>navigate(`/doctor/:${props.id}`)} >
            <p className='text-xl text-cyan-600'>{props.name}</p>
            <div className='flex flex-row'>

            {
                props.specialization.map((data,id)=>(
                    <p key={id} className='text-sm mr-2'>{data}</p>))
                }
                </div>
            <p className='text-md'>{props.experience} years experience</p>
            <p >Location</p>
            <p className='flex flex-row items-center'><BsCurrencyRupee/> {props.fees}</p>
        </div>
        <div className='flex flex-col  mt-20 items-center gap-2'>
           <p className='text-green-500'> Available Today</p>
        <div className=' bg-cyan-500 text-white py-2 px-8 text-sm rounded-sm cursor-pointer' onClick={()=>navigate(`/doctor/:${props.id}`)}>Book An Appointment</div>
        </div>
    </div>
  )
}

export default Doctorcard
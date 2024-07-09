import { useLazyQuery,gql } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchOpen, setSearchQuery } from '../store/appSlice.js';
import { IoLocationSharp } from "react-icons/io5";
import { GET_LISTING } from '../utils/queries.js';

// import { useSelector } from 'react-redux';



const SearchBar = () => {
    const display=useSelector((state=>state.app.searchOpen))
    const navigate=useNavigate()
    const dispatch= useDispatch()
    console.log(display)
    dispatch(setSearchOpen(true))
    const [text, setText] = useState("");
    const [location, setLocation]=useState('Springfield')
  const [getDoctors, { loading, error, data }] = useLazyQuery(GET_LISTING);

  useEffect(() => {
    if (text) {
      getDoctors({ variables: { name: text } });
    }
  }, [text, getDoctors,display]);

  const handleSpecialization=()=>{
     dispatch(setSearchQuery(text))
  }

//   console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex flex-col items-center mt-4 w-1/3">
        <div className="flex flex-row items-center border border-stone-600 w-full py-1 rounded-sm">
        <div className="flex flex-row border-r  gap-1 items-center">
            <IoLocationSharp/>
         <input value={location} type='text' placeholder={location} className='focus:border-transparent focus:outline-none' onChange={(e)=>setLocation(e.target.value)}></input>
        </div>
        <IoIosSearch className='fill-slate-500 mr-2 ml-1'/>
        <input type='text' placeholder='Search Doctors' value={text} onChange={(e)=>setText(e.target.value)}  className='w-full border-none focus:border-transparent focus:outline-none '/>
        </div>
        <div className= {display?"absolute w-[25rem] mt-8 ml-48 border-l rounded-lg bg-white ":"hidden"} >
        {
            text && data && (
                <>
                <p className='w-full border-b p-1 bg-gray-100'> Doctors</p>
                {data?.doctorName.slice(0,5).map((data,id)=>(
                    <div key={id} onClick={()=> navigate(`/doctor/:${data.id}`)} className='border-b p-1 w-full'>
                        {data.name}
                    </div>
                ))}
                <p className='w-full border-b bg-gray-100 p-1'>Specialization</p>
                {data?.getSpecialization.slice(0,5).map((data,id)=>(
                    <div key={id} onClick={()=> navigate(`/search/:${data.specialization}`)} className='border-b p-1 w-full'>
                        {data.specialization}
                    </div>
                ))}
                
                </>
            )

        }
        </div>
        

     </div>
  )
}

export default SearchBar

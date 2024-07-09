import React from 'react'
import SearchBar from '../components/SearchBar.js'
import { useQuery } from '@apollo/client'
import Doctorcard from '../components/Doctorcard.js'
import { useParams } from 'react-router-dom'
import { GET_DATA_SPECIAL } from '../utils/queries.js'




const SearchResult = () => {
    const { name } = useParams()
    // console.log(name.slice(1,name.length))
    const { loading, error, data} = useQuery(GET_DATA_SPECIAL,{
        variables: {"name": name.slice(1,name.length)}
    })
    
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log(data)
  return (
    <>
    <div className='flex flex-col '>
        <div className='flex flex-row justify-center border-b pb-6'>
            <SearchBar/>
        </div>
        <div className='flex flex-col py-6 px-60 items-center'>
            <p className='w-full pb-6 text-2xl border-b'>{data.getDoctorsBySpecialization.length} doctors availabe</p>
             {
                data.getDoctorsBySpecialization.map((data,index)=>(
                    <Doctorcard key={index} id={data.id} name={data.name} specialization={data.specialization} experience={data.experience} fees={data.fees} />
                ))
            } 
           
        </div>
    </div>
    </>
  )
}

export default SearchResult
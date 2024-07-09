import React, { useState } from 'react'
import { HealthCardData } from '../utils/HealthCardData.js';
import SearchBar from '../components/SearchBar.js';
import HomeCard from '../components/HomeCard.js';
import HealthCard from '../components/HealthCard.js';
import SliderComp from '../components/SliderComp.js';

import { useDispatch } from 'react-redux';


const Home = () => {
  const dispatch = useDispatch()
  return (
    <>
    <div className='flex flex-col items-center w-screen'>


     <SearchBar />
  
    
    
     

     <div className="flex flex-row gap-8 mt-20 mb-20 ml-38" >
     <HomeCard text1="Instant video consultation" text2="Connect within 60 seconds"/>
     <HomeCard text1="Find Doctors Near You" text2="Confirmed Apppointments"/>
     <HomeCard text1="Surgeries" text2="Safe and trusted surgeries center"/>
     </div>
     <p className='w-4/6 text-2xl'>Consult top doctors online for any health concern</p>
     <p className='w-4/6 text-sm'> Private online consultations with verified doctors in all specialists</p>
     <div className='flex flex-row gap-24 mt-10'>

     {
         HealthCardData.map(({title,link})=><HealthCard title={title} link={link} />)
        }
        </div>
     <p className='w-4/6 text-2xl mt-16'>Book an appointment for an in-clinic consultation</p>
     <p className='w-4/6 text-sm'> Find experienced doctors across all specialties</p>

     <SliderComp/>
    
    
    </div>
    </>
  )
}

export default Home
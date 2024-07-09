import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import Doctorcard from '../components/Doctorcard.js';
import SearchBar from '../components/SearchBar.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GET_DOCTORS } from '../utils/queries.js';



const DoctorList = () => {
  const [items, setItems] = useState([]);
  const limit = 6; // Number of doctors to fetch per request
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [doctorsBySpec, { data: speciality_data, loading, error }] =
    useMutation(GET_DOCTORS);
  const fetchChunkData = async (limit, offset) => {
    try {
      const data = await doctorsBySpec({
        variables: { limit: 6, offset: 0 },
      });
      console.log(data)
      setItems(data?.data?.getDoctors);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchChunkData()
  }, []);

  const fetchMoreData = async() => {
    setOffset(offset+6)
    if(offset>24){
      setHasMore(false);
    }

    try {
      const data = await doctorsBySpec({
        variables: { limit: 6, offset: offset },
      });
     
      setItems([...items,...data?.data?.getDoctors]);
    } catch (error) {
      console.log("Error", error);
    }



  };



  return (
    <>
      <div className='flex flex-col '>
        <div className='flex flex-row justify-center border-b pb-6'>
          <SearchBar />
        </div>
        <div className='flex flex-col w-screen py-6  items-center'>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          className='w-screen px-60'
          loader={<h4 className="text-center mb-10">Loading...</h4>}
          endMessage={<div className="text-center mb-10">Yay! You have seen it all</div>}
        >
            {items && items.map((doctor, index) => (
              <Doctorcard
                key={index}
                id={doctor.id}
                name={doctor.name}
                specialization={doctor.specialization}
                experience={doctor.experience}
                fees={doctor.fees}
              />
            ))}
            {loading && <p>Loading more...</p>}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default DoctorList;

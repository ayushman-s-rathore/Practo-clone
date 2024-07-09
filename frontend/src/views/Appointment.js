import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import clinicPic from '../assets/clinic.jpeg';
import { BsCurrencyRupee } from 'react-icons/bs';
import doc from '../assets/doctor.avif';
import { DELETE_APP, GET_APP } from '../utils/queries.js';

const Appointment = () => {
  const user = useSelector((store) => store.app.userDetail);
  const [item, setItem] = useState([]);

  const  { loading, error, data } = useQuery(GET_APP,{
    variables:{
        patientId: parseInt(user.id)
    }
  });
 console.log(data)


  

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className='flex flex-row flex-wrap bg-slate-300 h-screen'>
        {data?.getAppointmentsByPatient.map(({ clinic, doctor, time }) => (
          <div key={doctor.id + time} className="flex flex-row items-center w-1/4 h-fit bg-slate-300 p-4">
            <div className="flex flex-col bg-white p-4 rounded shadow-md w-full max-w-md">
              <p className="text-xl font-bold mb-2">In-clinic Appointment</p>
              <div className="flex items-center mb-4">
                <p className="mr-2">
                  <span role="img" aria-label="calendar">
                    📅
                  </span>{" "}
                  On {new Date().toDateString()}
                </p>
                <p className="ml-2">
                  <span role="img" aria-label="clock">
                    🕒
                  </span>{" "}
                  At {time.slice(5)}
                </p>
              </div>
              <div className="flex items-center mb-4">
                <img
                  className="h-16 w-16 rounded-full"
                  src={doc}
                  alt="Doctor's image"
                />
                <div className="ml-4">
                  <p className="font-bold">{doctor.name}</p>
                  <p className="text-sm flex flex-row ">{doctor.specialization}</p>
                  <p className="text-sm flex flex-row items-center">Fees: <BsCurrencyRupee />{doctor.fees}</p>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full"
                  src={clinicPic}
                  alt="Clinic's image"
                />
                <div className="ml-4">
                  <p className="font-bold">{clinic.name}</p>
                  <p className="text-sm">{clinic.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      clinic.address
                    )}`}
                    className="text-blue-500 text-sm"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Appointment;

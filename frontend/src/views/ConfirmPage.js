import {  useQuery } from "@apollo/client";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import doc from "../assets/doctor.avif";
import clinicPic from "../assets/clinic.jpeg";
import { GiConfirmed } from "react-icons/gi";
import { BsCurrencyRupee } from "react-icons/bs";
import { GET_DATA } from "../utils/queries.js";



const ConfirmPage = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const appointmentId = id.slice(1); // Remove the leading character from id

  const { loading, error, data } = useQuery(GET_DATA, {
    variables: { appId: appointmentId },
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { doctor, clinic } = data.getAppointmentDetails;
  return (
    <div className="flex flex-col items-center w-screen h-screen bg-slate-300">
      <div className="flex flex-col items-center w-screen h-screen bg-slate-300 p-4">
        <div className="flex flex-col bg-white p-4 rounded shadow-xl w-full max-w-md">
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
              At {data.getAppointmentDetails.time?.slice(5)}
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
              <p className="text-sm flex flex-row items-center">Fees: <BsCurrencyRupee/>{doctor.fees}</p>
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
      <GiConfirmed  className=" mt-12 h-10 w-10 text-green-500"/>
      <p className="text-3xl">Appointment Confirmed</p>
      </div>
    </div>
  );
};

export default ConfirmPage;

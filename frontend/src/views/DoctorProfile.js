import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import doc from "../assets/doctor.avif";
import clinicPic from "../assets/clinic.jpeg";
import SearchBar from "../components/SearchBar.js";
import { getNextDays } from "../utils/DateFormatterr.js";
import { useSelector } from "react-redux";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GiConfirmed } from "react-icons/gi";
import { BsCurrencyRupee } from "react-icons/bs";
import toast from "react-hot-toast";
import { ADD_APPOINTMENT, GET_AVAIL, GET_CLINIC, GET_CLINIC_AVAIL } from "../utils/queries.js";



const DoctorProfile = () => {
  const [makeEntry, setMakeEntry]=useState(false)
  const [entryMade, setEntryMade] =useState(false)
  const [throwError, setThrowError]=useState(true)
  const dateChosen="05-07"
  const [timeSlot, setTimeSlot] = useState("");
  const [clinicId, setClinicId] = useState("");
  const user = useSelector((store) => store.app.userDetail);
  const navigate = useNavigate();
  // console.log(user.id)

  const { id } = useParams();
  

  const { loading, error, data } = useQuery(GET_CLINIC, {
    variables: { docId: id?.slice(1) },
  });
  
  const {loading: loading3 ,error: error3,data: time_avail, fetchAvail} = useQuery(GET_CLINIC_AVAIL, {
    variables: {docId: id?.slice(1)}
  })


 
  // console.log(time)
  const [getAvailability, { loading: loading1,error: error1, data: data1 }] = useLazyQuery(GET_AVAIL);
  const [bookAppointment, {  loading: loading2,error: error2, data: data2 }] = useMutation(ADD_APPOINTMENT);
  if(data1 && data1.checkAvailability===false && throwError){
    toast.error("You have already booked appointment for this time")
    setThrowError(false)
  }

  const checkTimeSlotAvailability = (clinicId, time) => {
    const data=time_avail?.getBookedTimeSlots
    // console.log(data)
    // Find the clinic with the given clinicId
    if(data?.length==0)return false

    const clinic = data?.find((element) => element.clinicId==clinicId);
    // console.log(clinic)
  
    // If clinic is found, check if the time slot exists in the clinic's time array
    if (clinic) {
      return clinic?.time.includes(time);
    }
  
    // If the clinic is not found, return false
    return false;
  };
  // const fetchBooktimeSlots = (clinicId, time)
  useEffect(() => {
    if (timeSlot ) {
      getAvailability({
        variables: {
          docId: parseInt(id.slice(1)),
          patientId: parseInt(user.id),
          time: timeSlot,
          clinicId: parseInt(clinicId),
        },
      });
      setMakeEntry(true)
    }
    // console.log(data1, data1?.checkAvailability)
    if(data1 && data1?.checkAvailability && makeEntry){
      // console.log(id,user,timeSlot,clinicId)
      bookAppointment({
        variables:{
          docId: parseInt(id.slice(1)),
          patientId: parseInt(user.id),
          time: timeSlot,
          clinicId: parseInt(clinicId),
        }
      })
      setMakeEntry(false)
      setEntryMade(true)
      setTimeSlot("")
      // navigate(`/payment/:${data2?.addAppointment.id}`)
    }
  }, [timeSlot,data1]);
  if(entryMade && data2){
    navigate(`/payment/:${data2?.addAppointment?.id}`)
  }
  
  if (loading || loading1 || loading2) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (error1) return <p>Error: {error1.message}</p>;
  if (error2) return <p>Error: {error2.message}</p>;

  const days = getNextDays(3);
  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];
  
  const handleAppointment = (e) => {
    if (!user) {
      navigate("/login");
      return;
    }
    // setTimeChosen(e.target.innerHTML);
    setTimeSlot(dateChosen+" "+ e.target.innerHTML);
    
    
  };
  
  const clinics = data?.getDoctorWithClinics?.clinics;
  // console.log(data.getDoctorWithClinics.specialization)

  return (
    <div className="flex flex-col w-screen h-full items-center overflow-x-hidden">
      <SearchBar />
      <div className="w-full h-full px-80 pt-12 min-h-screen bg-slate-300 mt-6">
        <div className="flex flex-row w-full border bg-white px-10 py-4 rounded-lg">
          <img className="h-36 w-36" src={doc} alt="" />
          <div className="flex flex-col ml-10 gap-1">
            <p className="text-2xl text-cyan-600">{data.getDoctorWithClinics.name}</p>
            <div className="flex flex-row">

            {
              data && data.getDoctorWithClinics.specialization.map((spec)=><p className="text-l mr-2">{spec}</p>)
            }
            </div>
            <p className="text-md">{data.getDoctorWithClinics.experience} Years of experience</p>
            <p className="flex flex-row items-center text-md"> <GiConfirmed className="text-green-300 mr-2"/> Medical registration verified</p>
          </div>
        </div>
        <p className="text-xl mt-8">Clinics Info</p>
        {clinics.map((clinic) => (
          <div key={clinic.id} className="flex flex-col w-full shadow-xl bg-white mb-8 p-6 rounded-lg">
            <div className="flex flex-row">
              <img src={clinicPic} className="w-56 h-40" alt="Clinic" />
              <div className="flex flex-col ml-6">
                <p className="text-2xl">{clinic.name}</p>
                <p className="text-l">{clinic.address}</p>
                <p className="flex flex-row items-center text-l"><BsCurrencyRupee/> {data.getDoctorWithClinics.fees}</p>
              </div>
            </div>
            <div className="flex flex-col w-full items-center mt-6 border-t pt-4">

            <p className="text-3xl">Appointments</p>
            
            <div className="flex flex-row mt-4">
              {timeSlots.map((time, index) => (
                <>
                
                <div
                  key={index}
                  onClick={(e)=>{
                    setClinicId(clinic.id)
                    if(!checkTimeSlotAvailability(clinic.id,"05-07 "+time)){

                      handleAppointment(e)}}
                    }
                   className={checkTimeSlotAvailability(clinic.id,"05-07 "+time)?"border ml-2 text-md cursor-not-allowed  text-red-500 border-red-500 p-2 rounded-md": "border ml-2 text-md text-cyan-500 cursor-pointer  border-cyan-500  p-2 rounded-md"}
                    >
                  {time}
                </div>
                  </>
              ))}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorProfile;

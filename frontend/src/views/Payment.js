import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import doc from "../assets/doctor.avif";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import practo_logo from "../assets/PractoLogo.png";
import clinicPic from "../assets/clinic.jpeg";
import { useSelector } from "react-redux";
import { BsCurrencyRupee } from "react-icons/bs";
import { CREATE_PAYMENT, GET_APP_DATA, VERIFY_PAYMENT } from "../utils/queries.js";




const Payment = () => {
  const [clinicPay, setClinicPay] = useState(false);
  const [online, setOnline] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const appointmentId = id.slice(1); // Remove the leading character from id
  const user = useSelector((store) => store.app.userDetail);

  const { loading, error, data } = useQuery(GET_APP_DATA, {
    variables: { appId: appointmentId },
  });
  const [
    createPayment,
    { data: create_pay_data, loading1, error: create_pay_error },
  ] = useMutation(CREATE_PAYMENT);

  const [
    verifypayment,
    { data: verifyData, loading: verifyLoading, error: verifyError },
  ] = useMutation(VERIFY_PAYMENT);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { doctor, clinic } = data.getAppointmentDetails;
  const handlePayment = async () => {
    try {
      //   const res = loadScript("https://checkout.razorpay.com/v1/checkout.js");

      //   if (!res) {
      //     toast.error("Razorpay SDK failed to load.");
      //   }
      const { data } = await createPayment({
        variables: { amount: doctor.fees },
      });
      console.log("RESPONSE", data.createOrder);
      if (!data.createOrder.success) {
        throw new Error("Error while capturing payment");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        currency: data.createOrder.currency,
        amount: `${data.createOrder.amount}`,
        order_id: data.createOrder.id,
        name: "Practo",
        description: "Thank you for booking the appointment on Practo",
        image: practo_logo,
        prefill: {
          name: `${user.name} `,
          email: user.email,
        },
        handler: function (response) {
          verifyPayment({ ...response });
        },
      };
      const paymentObject = new window.Razorpay(options);
      console.log("payment", paymentObject);

      paymentObject.open();
      paymentObject.on("payment.failed", function (response) {
        toast.error("Oops! Payment Failed.");
        console.log(response.error);
      });
    } catch (error) {
      console.log("ERROR WHILE MAKING PAYMENT", error);
    }
  };
  const verifyPayment = async (response) => {
    try {
      //   console.log("response: ", response);

      const { data } = await verifypayment({
        variables: {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        },
      });

      console.log("DATA FROM VERIFY PAYMENT: ", data);
      if (!data?.verifyPayment.success) {
        throw new Error(data);
      }

      toast.success("Payment successful. Your appointment booked successfully");
      // now we have to insert this entry into appointment table

      navigate(`/confirm/:${appointmentId}`);
    } catch (error) {
      console.log("Error while calling verify payment API: ", error);
      toast.error("Could not verify payment");
    }
  };

  const handlePay = () => {
    if (online) {
      handlePayment();
    }
    if (clinicPay) {
      navigate(`/confirm/:${appointmentId}`);
    }
  };

  return (
    <>
      <div className="flex flex-row p-8 justify-center w-screen h-screen bg-slate-300">
        <div className="flex flex-col bg-white p-4 h-1/2 h-min rounded shadow-md w-full max-w-md">
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
              <p className="text-sm">{doctor.specialization}</p>
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
          <div className="flex flex-row mt-4 border-t border-b py-1">
            <input
              type="checkbox"
              checked={online}
              onClick={() => {
                setClinicPay(false);
                setOnline(true);
              }}
            ></input>
            <p className="flex felx-row items-center ml-2"><BsCurrencyRupee/>{doctor.fees} Pay Now</p>
          </div>
          <div className="flex flex-row border-b py-1 ">
            <input
              type="checkbox"
              checked={clinicPay}
              onClick={() => {
                setOnline(false);
                setClinicPay(true);
              }}
            ></input>
            <p className="flex felx-row items-center ml-2"><BsCurrencyRupee/>{doctor.fees} Pay At Cliniic</p>
          </div>
          <button className="bg-cyan-300 mt-6 p-2 rounded-lg" onClick={handlePay}>Confirm Visit</button>
        </div>
      </div>
    </>
  );
};

export default Payment;

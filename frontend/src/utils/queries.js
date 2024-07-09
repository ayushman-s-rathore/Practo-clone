import { gql } from "@apollo/client";

export const GET_APP=gql`
    query Query( $patientId: Int!){
        getAppointmentsByPatient(patientId: $patientId) {
          id 
          time
          doctor {
            id
            name
            specialization
            fees
            experience
          }
          clinic {
            name
            address
          }
       
        }
       }
`
export const GET_DATA = gql`
  query Query($appId: ID!) {
    getAppointmentDetails(appId: $appId) {
      time
      doctor {
        name
        specialization
        fees
      }
      clinic {
        address
      }
    }
  }
`;
export const DELETE_APP=gql`
mutation ExampleQuery($patientId: Int!, $docId: Int!, $time: String!) {
    deleteAppointment(patientId: $patientId, docId: $docId, time: $time) {
      patientId
    }
  }
  `
export const GET_CLINIC = gql`
  query getClinic($docId: ID!) {
    getDoctorWithClinics(id: $docId) {
      id
      name
      specialization
      experience
      fees
      clinics {
        id
        name
        address
      }
    }
  }
`;
export const GET_CLINIC_AVAIL=gql`
 query Query($docId: ID! ){
  getBookedTimeSlots(docId: $docId) {
    clinicId
    time
  }
}
`

export const GET_AVAIL = gql`
  query Query($docId: Int!, $patientId: Int!, $time: String!, $clinicId: Int!) {
    checkAvailability(
      docId: $docId
      patientId: $patientId
      time: $time
      clinicId: $clinicId
    )
  }
`;

export const ADD_APPOINTMENT = gql`
  mutation ExampleQuery(
    $patientId: Int!
    $docId: Int!
    $time: String!
    $clinicId: Int!
  ) {
    addAppointment(
      patientId: $patientId
      docId: $docId
      time: $time
      clinicId: $clinicId
    ) {
      id
    }
  }
`;
export const GET_DOCTORS = gql`
  mutation GetDoctors($limit: Int!, $offset: Int!) {
    getDoctors(limit: $limit, offset: $offset) {
      id
      name
      specialization
      experience
      fees
    }
  }
`;
export const GET_APP_DATA = gql`
  query Query($appId: ID!) {
    getAppointmentDetails(appId: $appId) {
      time
      doctor {
        name
        specialization
        fees
      }
      clinic {
        address
      }
    }
  }
`;
export const CREATE_PAYMENT = gql`
  mutation CreateOrder($amount: Int) {
    createOrder(amount: $amount) {
      id
      currency
      amount
      receipt
      status
      success
    }
  }
`;
export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment(
    $razorpayOrderId: String!
    $razorpayPaymentId: String!
    $razorpaySignature: String!
  ) {
    verifyPayment(
      razorpay_order_id: $razorpayOrderId
      razorpay_payment_id: $razorpayPaymentId
      razorpay_signature: $razorpaySignature
    ) {
      success
      message
    }
  }
`;
export const GET_DATA_SPECIAL=gql`
query getData($name : String!){
    getDoctorsBySpecialization(name: $name) {
    id,
    name,
    specialization,
    experience,
    fees,
  }
}
`
export const GET_LISTING=gql`
query getData($name : String!){
    doctorName(name: $name){
        id,
        name
    },
    getSpecialization(name: $name){
        specialization
    }
    }
    `
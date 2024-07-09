export const typeDefs = `#graphql
    type doctor{
        id: ID!,
        name: String!,
        specialization: [String],
        experience: Int!,
        fees: Int!,
        clinics: [Clinic!]!
    }
    type specialization{
        specialization: String!,
        doctorsId: [ID!],

    }
    type Clinic{
        id: ID!,
        name: String!,
        address: String!,
        appointments: [Appointment]
    }
    type Appointment {
  id: ID!
  patientId: Int!
  docId: Int!
  time: String!
  clinicId: Int!
  doctor: doctor!
  clinic: Clinic!
}
type Order {
    id: String
    currency: String
    amount: Int
    receipt: String
    status: String
    success:Boolean
  }
type PaymentVerificationResponse{
    success: Boolean
    message: String

  }
  type TimeSlot{
    clinicId: Int
    time: [String]
  }
  
    type Query{
        doctors: [doctor],
        doctorName(name: String!): [doctor]
        getSpecialization(name: String!): [specialization]
        getDoctorsBySpecialization(name: String): [doctor]
        getDoctorWithClinics(id: ID!): doctor 
        doctorID(id: ID!): [doctor]
        checkAvailability(docId: Int!, patientId: Int!, time: String!, clinicId: Int!): Boolean!
        getAppointmentDetails(appId: ID!): Appointment,
        checkAppointmentAvail(docId: Int!) : [Clinic]
        getAppointmentsByPatient(patientId: Int!): [Appointment]
        getBookedTimeSlots(docId: ID!): [TimeSlot]
    }
    type Mutation {
     getDoctors(limit: Int!, offset: Int!): [doctor]
    addAppointment(patientId: Int!, docId: Int!, time: String!, clinicId: Int!): Appointment!
    verifyPayment(razorpay_order_id: String!, razorpay_payment_id: String!, razorpay_signature: String!): PaymentVerificationResponse
    createOrder(amount: Int): Order,
    deleteAppointment(patientId: Int!, docId: Int!, time: String!) : Appointment
  }
`;

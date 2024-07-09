import Razorpay from "razorpay";
import crypto from "crypto";
export const resolvers = {
  Query: {
    async doctors(_, __, { pool }) {
      const [rows] = await pool.query("Select * from Doctors");
      // console.log(rows[0])
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        specialization: JSON.parse(row.specialization),
        experience: row.experience,
        fees: row.Fees,
      }));
    },
    async doctorName(_, args, { pool }) {
      // console.log(args.name)
      const [rows] = await pool.query(
        "SELECT * FROM Doctors WHERE name LIKE ? ",
        [`%${args.name}%`]
      );

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        specialization: JSON.parse(row.specialization),
        experience: row.experience,
        fees: row.Fees,
      }));
    },
    async getSpecialization(_, args, { pool }) {
      const [rows] = await pool.query(
        "SELECT * FROM specialization WHERE specialization LIKE ? ",
        [`%${args.name}%`]
      );
      // console.log(rows)

      return rows.map((row) => ({
        specialization: row.specialization,
        doctorsId: JSON.parse(row.doctors_id),
      }));
    },
    async doctorID(_, args, { pool }) {
      // console.log(args.name)
      const [rows] = await pool.query("SELECT * FROM Doctors WHERE id = ? ", [
        args.id,
      ]);

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        specialization: JSON.parse(row.specialization),
        experience: row.experience,
        fees: row.Fees,
      }));
    },
    getDoctorsBySpecialization: async (parent, { name }, { pool }) => {
      const [specializationRows] = await pool.query(
        "SELECT * FROM specialization WHERE specialization = ?",
        [name]
      );
      if (specializationRows.length === 0) {
        return [];
      }

      const specialization = specializationRows[0];
      // console.log(specialization)
      const doctorIds = JSON.parse(specialization.doctors_id);
      console.log(doctorIds);

      const [rows] = await pool.query("SELECT * FROM Doctors WHERE id IN (?)", [
        doctorIds,
      ]);
      // console.log(rows)
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        specialization: JSON.parse(row.specialization),
        experience: row.experience,
        fees: row.Fees,
      }));
    },
    getDoctorWithClinics: async (_, { id }, { pool }) => {
      const [doctorRows] = await pool.query(
        "SELECT * FROM Doctors WHERE id = ?",
        [id]
      );
      const doctor = doctorRows[0];

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      const [clinicMappingRows] = await pool.query(
        "SELECT clinic_id FROM doc_clinic WHERE doc_id = ?",
        [id]
      );
      const clinicIds = clinicMappingRows.map((row) => row.clinic_id);

      const [clinicRows] = await pool.query(
        "SELECT * FROM Clinics WHERE id IN (?)",
        [clinicIds]
      );
      //   console.log(doctor);
      return {
        id: doctor.id,
        name: doctor.name,
        experience: doctor.experience,
        fees: doctor.Fees,
        specialization: JSON.parse(doctor.specialization),
        clinics: clinicRows,
      };
    },
    checkAppointmentAvail: async (_, { docId }, { pool }) => {
      const [results] = await pool.query(
        `SELECT
            c.id AS clinic_id,
            c.name AS clinic_name,
            c.address AS clinic_address,
            a.id AS appointment_id,
            a.patient_id,
            a.time_slot,
            d.id AS doctor_id,
            d.name AS doctor_name,
            d.specialization
          FROM doc_clinic cdm
          JOIN Clinics c ON cdm.clinic_id = c.id
          JOIN patient_doctor_mapping a ON a.clinic_id = c.id
          JOIN Doctors d ON a.doc_id = d.id
          WHERE cdm.doc_id = ?`,
        [docId]
      );

      const clinicsMap = new Map();

      results.forEach((row) => {
        if (!clinicsMap.has(row.clinic_id)) {
          clinicsMap.set(row.clinic_id, {
            id: row.clinic_id,
            name: row.clinic_name,
            address: row.clinic_address,
            appointments: [],
          });
        }
        const clinic = clinicsMap.get(row.clinic_id);
        clinic.appointments.push({
          id: row.appointment_id,
          patientId: row.patient_id,
          docId: row.doctor_id,
          time: row.time_slot,
          clinicId: row.clinic_id,
          doctor: {
            id: row.doctor_id,
            name: row.doctor_name,
            specialization: JSON.parse(row.specialization),
          },
          clinic: {
            id: row.clinic_id,
            name: row.clinic_name,
            address: row.clinic_address,
          },
        });
      });
      const clinics = Array.from(clinicsMap.values())
      console.log(clinics)
      return clinics
    },
    checkAvailability: async (
      _,
      { docId, patientId, time, clinicId },
      { pool }
    ) => {
      try {
        const [docRows] = await pool.query(
          "SELECT * FROM patient_doctor_mapping WHERE doc_id = ? AND time_slot = ?",
          [docId, time]
        );
        if (docRows.length > 0) {
          return false; // Doctor is not available
        }

        const [patientRows] = await pool.query(
          "SELECT * FROM patient_doctor_mapping WHERE patient_id = ? AND time_slot = ?",
          [patientId, time]
        );
        if (patientRows.length > 0) {
          return false; // Patient is not available
        }
        const [clinicRows] = await pool.query(
          "SELECT * FROM patient_doctor_mapping WHERE clinic_id = ? AND time_slot = ?",
          [clinicId, time]
        );
        if (clinicRows.length > 0) {
          return false; // Patient is not available
        }

        return true; // Both doctor and patient are available
      } catch (err) {
        console.error(err);
        throw new Error(err);
      }
    },
    
    getAppointmentsByPatient: async (_, { patientId }, { pool }) => {
        const query = `
        SELECT 
          a.id AS appointment_id, a.time_slot AS time_slot, d.experience AS experience,
          d.id AS doctor_id, d.name AS doctor_name, d.specialization AS doctor_specialization, d.fees AS doctor_fees,
          c.id AS clinic_id, c.name AS clinic_name, c.address AS clinic_address
        FROM patient_doctor_mapping a
        JOIN Doctors d ON a.doc_id = d.id
        JOIN Clinics c ON a.clinic_id = c.id
        WHERE a.patient_id = ?;
      `;

      const [rows] = await pool.query(query, [patientId]);

      const appointments = rows.map(row => ({
        id: row.appointment_id,
        time: row.time_slot,
        doctor: {
          id: row.doctor_id,
          name: row.doctor_name,
          specialization: JSON.parse(row.doctor_specialization),
          experience: row.experience,
          fees: row.doctor_fees
        },
        clinic: {
          id: row.clinic_id,
          name: row.clinic_name,
          address: row.clinic_address
        }
      }));

      return appointments;

      },
      getBookedTimeSlots: async (_, { docId }, { pool }) => {
        const [rows] = await pool.query(
          "SELECT time_slot , clinic_id FROM patient_doctor_mapping WHERE doc_id = ? ",
          [docId]
        );
        const clinics= new Map()
        rows.forEach((row)=>{
            if(!clinics.has(row.clinic_id)){
                clinics.set(row.clinic_id, {
                    clinicId: row.clinic_id,
                    time: [],
                })
            }
            const clinic= clinics.get(row.clinic_id)
            clinic.time.push(row.time_slot)
        })
        const result=Array.from(clinics.values())
        console.log(result)



        return result
      },
    getAppointmentDetails: async (_, { appId }, { pool }) => {
      const [rows] = await pool.query(
        `SELECT a.id, a.patient_id, a.time_slot, d.id as doctor_id, d.name as doctor_name, 
                  d.specialization, d.experience, d.fees, c.id as clinic_id, c.name as clinic_name, 
                  c.address as clinic_address
           FROM patient_doctor_mapping a
           JOIN Doctors d ON a.doc_id = d.id
           JOIN Clinics c ON a.clinic_id = c.id
           WHERE a.id = ?`,
        [appId]
      );

      if (rows.length === 0) {
        throw new Error("Appointment not found");
      }

      const row = rows[0];

      return {
        id: row.id,
        patientId: row.patient_id,
        time: row.time_slot,
        doctor: {
          id: row.doctor_id,
          name: row.doctor_name,
          specialization: JSON.parse(row.specialization),
          experience: row.experience,
          fees: row.fees,
        },
        clinic: {
          id: row.clinic_id,
          name: row.clinic_name,
          address: row.clinic_address,
        },
      };
    },
  },
  Mutation: {
    addAppointment: async (
      _,
      { patientId, docId, time, clinicId },
      { pool }
    ) => {
      try {
        const [result] = await pool.query(
          "INSERT INTO patient_doctor_mapping (patient_id, doc_id,clinic_id, time_slot) VALUES (?, ?, ?, ?)",
          [patientId, docId, clinicId, time]
        );
        console.log(result);
        return {
          id: result.insertId,
          patientId,
          docId,
          time,
          clinicId,
        };
      } catch (err) {
        console.error(err);
        throw new Error("Error adding appointment");
      }
    },
    createOrder: async (_, { amount }) => {
      var options = {
        amount: amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
      };

      try {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const paymentResponse = await instance.orders.create(options);
        console.log("instance", paymentResponse);
        return {
          id: paymentResponse.id,
          currency: paymentResponse.currency,
          amount: paymentResponse.amount,
          receipt: paymentResponse.receipt,
          status: paymentResponse.status,
          success: true,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    deleteAppointment: async(_,{ patientId, docId, time},{ pool })=>{
        try{
            const res=await pool.query("DELETE FROM patient_doctor_mapping WHERE doc_id=? AND patient_id=? AND time_slot=?", [docId,patientId,time])
            // const [row]=await pool.query("SELECT * FROM patient_doctor_mapping WHERE doc_id=? AND patient_id=? AND time_slot=?", [docId,patientId,time])

            return {
                patientId: patientId,
                docId: docId,

            }
        }catch(err){
            console.log(err)
            throw new Error(err)
        }
        },
    getDoctors: async (_, { limit, offset }, { pool }) => {
        const query = `
          SELECT * FROM Doctors
          LIMIT ? OFFSET ?;
        `;
        const [rows] = await pool.query(query, [limit, offset]);
        return rows.map(row => ({
          id: row.id,
          name: row.name,
          specialization: JSON.parse(row.specialization),
          experience: row.experience,
          fees: row.Fees
        }));
      },
    verifyPayment: async (
      _,
      { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    ) => {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        // Add your business logic here (e.g., enroll student, update database, etc.)
        return { success: true, message: "Payment Verified" };
      }

      return { success: false, message: "Payment Failed" };
    },
  },
};

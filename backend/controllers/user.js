
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import mysql from 'mysql2/promise.js'

dotenv.config({
    path: "../env"
})
async function makeConnection(){

    const pool=mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT   
    
    })
    await pool.getConnection()
    return pool
}

export const Login=async(req,res)=>{
    try{
        const pool= await makeConnection()
        const {email,password}=req.body
        if(!email || !password){
            return res.status(401).json({
                message: "Invalid data",
                success: false
            })
        }
        const regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if(!email.match(regex)){
            return res.status(401).json({
                message: "Please write a valid Email Id",
                success: false
            })
        }
        const [user] = await pool.query("Select id,name ,email,password from Patients where email=?",[email])
        if(user.length==0){
            return res.status(401).json({
                message: "Invalid emaild or password",
                success: false
            })
        }
    
        const isMatch = await bcryptjs.compare(password,user[0].password)
        if(!isMatch){
            return res.status(401).json({
                message: "Access denied",
                success: false
            })
        }
        const token= jwt.sign({email},process.env.SECRET_KEY,{expiresIn: "1d"})
        return res.status(200).cookie("token",token, {httpOnly: true }).json({
            message: `Welcome ${user[0].name}`,
            user,
            success: true
        })

    }catch(error){
        console.log(error)
    }
}
export const Logout= async(req,res)=>{
    return res.status(200).cookie("token","", {expiresIn:new Date(Date.now()), httpOnly: true}).json({
        message: "User LogOut successfully",
        success: true
    })
}
export const Register= async (req,res)=>{
    try{
        const pool=await makeConnection()
        const {fullName,email, password,cnfPassword}= req.body
        console.log(req.body)
        if(!fullName || !email || !password || !cnfPassword){
            return res.status(401).json({
                message: "Invalid Data",
                success: false
            })
        }
        if(password!==cnfPassword){
            return res.status(401).json({
                message: "Confirm password does not match with password",
                success: false
            })
        }
        const regex=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if(!email.match(regex)){
            return res.status(401).json({
                message: "Please write a valid Email Id",
                success: false
            })
        }
        const [user]= await pool.query("Select email from Patients where email=?",[email])
        if(user.length){
            return res.status(401).json({
                message: "Email already exist",
                success: false
            })
        }
        const hashedPassword= await bcryptjs.hash(password,16)
        await pool.query("INSERT INTO Patients Values (?,?,?,?)",[,fullName,email,hashedPassword])
        return res.status(201).json({
            message: "Account created Successfully",
            success: true
        })

    }catch(error){
        console.log(error)
    }

}
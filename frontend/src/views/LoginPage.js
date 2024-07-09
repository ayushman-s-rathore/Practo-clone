import React, { useState } from "react";
import logo from "../assets/login.webp";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { setUserDetail } from "../store/appSlice.js";



const LoginPage = () => {
    
    const dispatch= useDispatch()
    const navigate= useNavigate()
    const [loading, setLoading]= useState(false)
  const [Login, setLogin] = useState(false);
  const [email, setEmail]= useState("")
    const [password,setPassword]=useState("")
    const [fullName, setName]=useState("")
    const [cnfPassword, setCnfPassword]= useState("")

    const handleFormSubmission=async (e)=>{
        e.preventDefault()
        setLoading(true)
        if(!Login){
            const user={fullName,email,password,cnfPassword}
            try{
              const res= await axios.post("https://practo-clone.onrender.com/api/user/register",user)
              if(res.data.success){
                
                toast.success(res.data.message)
              }
              setLogin(true)
              
            }catch(error){
              console.log(error)
              toast.error(error.response.data.message)
            }finally{
              setLoading(false)
            }
  
          }else{
            setLoading(true)
            try{
              const res= await axios.post(`https://practo-clone.onrender.com/api/user/login`,{email, password})
             if(res.data.success){
                toast.success(res.data.message)
              }
              localStorage.setItem("user",JSON.stringify(res.data.user[0]))
              dispatch(setUserDetail(res.data.user[0]))
            // console.log(res.data.user)
              navigate(-1)
            }catch(error){
              console.log(error)
              toast.error(error.response.data.message)
  
            }finally{
              setLoading(false)
            }
          }
  
          setName("")
          setEmail("")
          setPassword("")
          setCnfPassword("")
  
    }
  return (
    <>
      <div className="flex flex-row justify-around mx-96 mt-4 mb-4 border-b">
        <div className={Login?"mr-14 hover:cursor-pointer border-b pb-4 px-2 border-b-4 border-cyan-300":"mr-10 hover:cursor-pointer"} onClick={()=>setLogin(true)}> Login</div>
      <div className={!Login?"hover:cursor-pointer border-b pb-4 px-2 border-b-4 border-cyan-300":"hover:cursor-pointer"} onClick={()=>setLogin(false)}>Register</div>
      </div>
      
      <div className="flex flex-row justify-center mt-12">
        <img src={logo} className="h-96 w-96"></img>

        <form onSubmit={handleFormSubmission} className="flex flex-col border rounded-md w-96 p-10 ml-12 h-fit ">
          {!Login && (
            <>
              <label>Full Name</label>
              <input
              value={fullName}
              onChange={(e)=>setName(e.target.value)}
                className="w-full p-1 rounded-md border mb-6 mt-2"
                type="text"
                placeholder="Full Name"
              ></input>
            </>
          )}
          <label>Email ID</label>
          <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-1 border rounded-md mb-6 mt-2"
            type="email"
            placeholder="EmailID"
          ></input>
          <label>Password</label>
          <input
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
            className="w-full border  p-1 rounded-md mb-6 mt-2"
            type="password"
            placeholder="Password"
          ></input>
          {!Login && (
            <>
              <label>Confirm Password</label>
              <input
              value={cnfPassword}
              onChange={(e)=>setCnfPassword(e.target.value)}
                className="w-full border p-1 rounded-md mb-6 mt-2"
                type="password"
                placeholder="Confirm Password"
              ></input>
            </>
          )}
          <button type="submit" className="bg-cyan-400 p-2 rounded-md">
            {Login ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;

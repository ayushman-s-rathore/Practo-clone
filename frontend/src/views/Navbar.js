import React from 'react'
import logo from '../assets/PractoLogo.png'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetail } from '../store/appSlice.js'

const Navbar = () => {
    const navigate= useNavigate()
    const dispatch=useDispatch()
    const user = useSelector(store=>store.app.userDetail)
    // console.log(user)
  return (
    <div className='flex flex-row border w-screen justify-around py-4'>
        <div className='flex flex-row'>

        <div className=' w-32 hover:cursor-pointer' onClick={()=>navigate('/')}><img src={logo} alt='practo-logo'></img></div>
        <div className='text-l ml-12 hover:cursor-pointer' onClick={()=>navigate('/doctors')}>Find Doctors</div>
        </div>
        {
          user == null &&
          <button className='border rounded-sm px-2 py-1 text-sm text-stone-600 hover:text-cyan-600 hover:border-cyan-600' onClick={()=> navigate('/login')}>Login/SignUp</button>
        }
        {
          user != null && (
            <div className='flex flex-row'>
            <div className="p-2 border rounded-sm px-2 py-1 text-sm cursor-pointer text-stone-600 hover:text-cyan-600 hover:border-cyan-600 mr-6" onClick={()=>navigate('/appointments')}>Your Appointments</div>
            <button className='border rounded-sm px-2 py-1 text-sm text-stone-600 hover:text-cyan-600 hover:border-cyan-600' onClick={()=>{ 
              localStorage.removeItem("user")
              dispatch(setUserDetail(null))
              navigate('/')
            }}>Logout</button>
            </div>
          )
        }
    </div>
  )
}

export default Navbar
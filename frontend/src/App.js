
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './views/Navbar.js';
import Home from './views/Home.js';

import SearchResult from './views/SearchResult.js';
import DoctorProfile from './views/DoctorProfile.js';
import LoginPage from './views/LoginPage.js';
import Payment from './views/Payment.js';
import ConfirmPage from './views/ConfirmPage.js';
import Appointment from './views/Appointment.js';
import ListingInf from './views/ListingInf.js';
import { useSelector } from 'react-redux';

function App() {
  const user=useSelector(store=>store.app.userDetail)
  return (
    <>
     <BrowserRouter>
        <Navbar/>
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/doctors' element={<ListingInf/>}/>
        <Route path='/search/:name' element={<SearchResult/>}/>
        <Route path='/doctor/:id' element={<DoctorProfile/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/payment/:id' element={user?<Payment/>:<LoginPage/>}/>
        <Route path='confirm/:id' element={user?<ConfirmPage/>:<LoginPage/>}/>
        <Route path='/appointments' element={user?<Appointment/>:<LoginPage/>}></Route>
        {/* <Route path='/listing' element={<ListingInf/>}/> */}
       </Routes>
     
     </BrowserRouter>
     
    </>
  );
}

export default App;

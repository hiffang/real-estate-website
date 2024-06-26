import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Listing from './pages/Listing';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing'
import Search from './pages/Search';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import Footer from './components/Footer';
import TermsOfService from './pages/TermsofService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookieConsent from './components/CookieConsent';
import DashboardApprove from './pages/Dashboard/DashboardApprove.jsx';
import DashboardHome from './pages/Dashboard/DashboardHome.jsx';
import DashboardListings from './pages/Dashboard/DashboardListings.jsx';
import DashboardAnalytics from './pages/Dashboard/DashboardAnalytics.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from './redux/user/userSlice.js';




export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      // Make an API call to log out the user
      try {
        dispatch(signOutUserStart());
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!data.success) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <BrowserRouter>
    <Header />
    <CookieConsent />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/terms' element={<TermsOfService />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/dashboard/dashboard-approve' element={<DashboardApprove />} />
          <Route path='/dashboard/view-listings' element={<DashboardListings />} />
          <Route path='/dashboard/analytics' element={<DashboardAnalytics />} />
          <Route path='/dashboard-home' element={<DashboardHome />} />
        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

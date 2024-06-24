import React from 'react';
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


export default function App() {
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
          <Route path='/dashboard-home' element={<DashboardHome />} />
        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

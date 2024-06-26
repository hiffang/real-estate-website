import React, { useEffect, useState } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import icon from '../Untitled design (4).png';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className='bg-yellow-300 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <div className='flex items-center'>
          <div
            className='sm:hidden text-slate-700 mr-2 cursor-pointer'
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes className='h-10 w-4 text-slate-700' /> : <FaBars className='h-10 w-4 text-slate-700' />}
          </div>
          <Link to='/'>
            <div className='flex items-center'>
              <img src={icon} className='h-8' alt="icon" />
              <h1 className='text-black text-1xl mt-1 font-bold ml-2'>Bordima.lk</h1>
            </div>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-full flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>

        <div className='flex items-center'>
          <ul className='hidden sm:flex gap-4'>
            <Link to='/'>
              <li className='text-black text-1xl font-semibold py-1 hover:text-cyan-400 transition'>
                Home
              </li>
            </Link>
            <Link to='/about'>
              <li className='text-black text-1xl font-semibold py-1 hover:text-cyan-400 transition'>
                About 
              </li>
            </Link>
            <Link to='/create-listing'>
              <li className='text-black text-1xl font-semibold py-1 hover:text-cyan-400 transition'>
                Add your place
              </li>
            </Link>
            <Link to='/profile'>
              {currentUser ? (
                <img
                  className='rounded-full h-7 mt-1 w-7 object-cover'
                  src={currentUser.avatar}
                  alt='profile'
                />
              ) : (
                <li className='text-white font-semibold'> <button className='bg-red-700 rounded-lg px-3 py-1 hover:bg-orange-500 transition'>Sign In</button></li>
              )}
            </Link>
            {currentUser && currentUser.isAdmin && (
              <Link to='/dashboard-home' onClick={closeMenu}>
                <li className='text-black hover:text-cyan-400 transition py-1 font-semibold'>
                  Dashboard
                </li>
              </Link>
            )}
              
          </ul>
        </div>
      </div>
      {menuOpen && (
        <div className='sm:hidden bg-orange-100 shadow-md font-bold'>
          <ul className='flex flex-col items-center gap-4 p-4'>
            <Link to='/' onClick={closeMenu}>
              <li className='text-slate-700 hover:underline hover:text-cyan-400 transition'>
                Home
              </li>
            </Link>
            <Link to='/about' onClick={closeMenu}>
              <li className='text-slate-700 hover:underline hover:text-cyan-400 transition'>
                About
              </li>
            </Link>
            <Link to='/create-listing' onClick={closeMenu}>
              <li className='text-slate-700 hover:underline hover:text-cyan-400 transition'>
                Add your place
              </li>
            </Link>
            <Link to='/profile' onClick={closeMenu}>
              {currentUser ? (
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar}
                  alt='profile'
                />
              ) : (
                <li className='text-slate-700 hover:underline'>Sign in</li>
              )}
            </Link>
          </ul>
        </div>
      )}
    </header>
  );
}

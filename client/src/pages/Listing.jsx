import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaUtensils,
  FaShare,
  FaWind,
  FaWater,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import Loading from '../components/Loading';


// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const formatListingType = (type) => {
    switch (type) {
      case 'hostel':
        return 'Hostel';
      case 'singleroom':
        return 'Single Room';
      case 'guesthouse':
        return 'Guest House';
      case 'annex':
        return 'Annex';
      case 'bungalow':
        return 'Bungalow';
      case 'fullhouseholiday':
        return 'Full house for holiday';
      case 'fullhouserent':
        return 'Full house for rent';
      default:
        return type; // fallback if type is not recognized
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <Loading />}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-3xl text-black-500 font-extrabold'>
              {listing.name}
            </p>
            <div className='text-2xl text-orange-500 font-bold '>Rs.{' '}
              {listing.rent}/{listing.rentType}</div>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.city}, {listing.district}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              {formatListingType(listing.type)}
              </p>
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Address : </span>
              {listing.address}
            </p>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description: </span>
              <p>{listing.description}</p>
            </p>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Terms: </span>
              <p>{listing.rules}</p>
            </p>
            <p className='font-semibold'>Facilities:</p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'> 
              {(listing.type === 'singleroom' || listing.type === 'sharedroom' || listing.type === 'hostel') && ( 
                <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.beds > 1
                  ? `${listing.beds} beds `
                  : `${listing.beds} bed `}
              </li>)}

              {(listing.type === 'annex' || listing.type === 'bungalow' || listing.type === 'guesthouse' || listing.type === 'fullhouseholiday' || listing.type === 'fullhouserent') && ( 
                <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.beds} bedrooms `
                  : `${listing.beds} bedroom `}
              </li>)}
             
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms `
                  : `${listing.bathrooms} bathroom `}
              </li>
              {listing.parking && (
  <li className='flex items-center gap-1 whitespace-nowrap '>
    <FaParking className='text-lg' />
    Parking spot
  </li>
)}
{listing.furnished && (
  <li className='flex items-center gap-1 whitespace-nowrap '>
    <FaChair className='text-lg' />
    Furnished
  </li>
)}
{listing.kitchen && (
  <li className='flex items-center gap-1 whitespace-nowrap '>
    <FaUtensils className='text-lg' />
    Kitchen
  </li>
)}
{listing.aircondition && (
  <li className='flex items-center gap-1 whitespace-nowrap '>
    <FaWind className='text-lg' />
    Air conditioning
  </li>
)}
{listing.hotwater && (
  <li className='flex items-center gap-1 whitespace-nowrap '>
    <FaWater className='text-lg' />
    Hot water
  </li>
)}

            </ul>
            
            {currentUser &&<div>
                  <p className='text-green-700'>
                    Status: {listing.status === 'approved' ? 'Approved' : 'Waiting for approval'}
                  </p>
                  
                </div>
                }
                
              
            
            
                <Contact listing={listing} user={currentUser} />
          </div>
        </div>
      )}
    </main>
  );
}

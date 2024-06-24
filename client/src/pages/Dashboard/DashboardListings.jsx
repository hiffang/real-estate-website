// ListingsPage.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Loading from '../../components/Loading';
import { Link } from 'react-router-dom';

const DashboardListings = () => {
  const [hostelListings, sethostelListings] = useState([]);
  const [singleRoomListings, setSingleRoomListings] = useState([]);
  const [sharedRoomListings, setSharedRoomListings] = useState([]);
  const [guesthouseListings, setguesthouseListings] = useState([]);
  const [annexListings, setannexListings] = useState([]);
  const [bungalowListings, setbungalowListings] = useState([]);
  const [fullhouseholidayListings, setfullhouseholidayListings] = useState([]);
  const [fullhouserentListings, setfullhouserentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDisapproveModal, setShowDisapproveModal] = useState(false);
  const [listingIdToDisapprove, setListingIdToDisapprove] = useState('');


 const handleDisapproveListing = async () => {
    try {
      const res = await fetch(`/api/listing/disapprove/${listingIdToDisapprove}`, {
        method: 'PATCH',
      });
      
      const data = await res.json();
      setShowDisapproveModal(false);
    } catch (error) {
      console.error('Error disapproving listing:', error.message);
    }
  };
  

   


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [hostelRes, singleRoomRes, sharedRoomRes, guesthouseRes, annexRes, bungalowRes, fullhouseholidayRes, fullhouserentRes] = await Promise.all([
          fetch('/api/listing/get?type=hostel&status=approved'),
          fetch('/api/listing/get?type=singleroom&status=approved'),
          fetch('/api/listing/get?type=sharedroom&status=approved'),
          fetch('/api/listing/get?type=guesthouse&status=approved'),
          fetch('/api/listing/get?type=annex&status=approved'),
          fetch('/api/listing/get?type=bungalow&status=approved'),
          fetch('/api/listing/get?type=fullhouseholiday&status=approved'),
          fetch('/api/listing/get?type=fullhouserent&status=approved')
        ]);

        if (!hostelRes.ok || !singleRoomRes.ok || !sharedRoomRes.ok || !guesthouseRes.ok || !annexRes.ok || !bungalowRes.ok || !fullhouseholidayRes.ok || !fullhouserentRes.ok ) {
          throw new Error('Failed to fetch listings');
        }

        const [ hostelData, singleRoomData, sharedRoomData, guesthouseData, annexData, bungalowData, fullhouseholidayData, fullhouserentData] = await Promise.all([
          hostelRes.json(),
          singleRoomRes.json(),
          sharedRoomRes.json(),
          guesthouseRes.json(),
          annexRes.json(),
          bungalowRes.json(),
          fullhouseholidayRes.json(),
          fullhouserentRes.json()
        ]);

        sethostelListings(hostelData);
        setSingleRoomListings(singleRoomData);
        setSharedRoomListings(sharedRoomData);
        setguesthouseListings(guesthouseData);
        setannexListings(annexData);
        setbungalowListings(bungalowData);
        setfullhouseholidayListings(fullhouseholidayData);
        setfullhouserentListings(fullhouserentData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


    return (
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          {singleRoomListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Single rooms</h2>
              
            </div>
            <div className='flex flex-wrap gap-4'>
              {singleRoomListings.map((listing) => (
                <div key={listing._id} className="p-4 border rounded-md shadow-md">
                    <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
                <h2 className="text-lg font-semibold">{listing.name}</h2>
               
                 <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
                
                {/* Add more details as needed */}
            </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{sharedRoomListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Shared rooms</h2>
            </div>
            <div className='flex flex-wrap gap-4'>
              {sharedRoomListings.map((listing) => (
                <div key={listing._id} className="p-4 border rounded-md shadow-md">
                    <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
                <h2 className="text-lg font-semibold">{listing.name}</h2>
               
                 <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
                
                {/* Add more details as needed */}
            </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {hostelListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Hostels</h2>

            </div>
            <div className='flex flex-wrap gap-4'>
              {hostelListings.map((listing) => (
                <div key={listing._id} className="p-4 border rounded-md shadow-md">
                    <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
                <h2 className="text-lg font-semibold">{listing.name}</h2>
                
                <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
                {/* Add more details as needed */}
            </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        

{guesthouseListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Guest houses</h2>
            </div>
            <div className='flex flex-wrap gap-4'>
              {guesthouseListings.map((listing) => (
                <div key={listing._id} className="p-4 border rounded-md shadow-md">
                    <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
                <h2 className="text-lg font-semibold">{listing.name}</h2>
                
                <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
                {/* Add more details as needed */}
            </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{annexListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Annexes</h2>
              
            </div>
            <div className='flex flex-wrap gap-4'>
              {annexListings.map((listing) => (
               <div key={listing._id} className="p-4 border rounded-md shadow-md">
                <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
               <h2 className="text-lg font-semibold">{listing.name}</h2>
               
               <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
               {/* Add more details as needed */}
           </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{bungalowListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Bungalows</h2>
            </div>
            <div className='flex flex-wrap gap-4'>
              {bungalowListings.map((listing) => (
                <div key={listing._id} className="p-4 border rounded-md shadow-md">
                    <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
                <h2 className="text-lg font-semibold">{listing.name}</h2>
                
                <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
                {/* Add more details as needed */}
            </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{fullhouseholidayListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Full houses vacation</h2>
            </div>
            <div className='flex flex-wrap gap-4'>
              {fullhouseholidayListings.map((listing) => (
                 <div key={listing._id} className="p-4 border rounded-md shadow-md">
                    <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
                 <h2 className="text-lg font-semibold">{listing.name}</h2>
                
                 <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
                 {/* Add more details as needed */}
             </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{fullhouserentListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Full houses for rent</h2>
            </div>
            <div className='flex flex-wrap gap-4'>
              {fullhouserentListings.map((listing) => (
                 <div key={listing._id} className="p-4 border rounded-md shadow-md">
                    <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
                 <h2 className="text-lg font-semibold">{listing.name}</h2>
                 
                 <button
                        type='button'
                        className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowDisapproveModal(true);
                          setListingIdToDisapprove(listing._id);
                        }}
                      >
                        Dispprove
                      </button>
                 {/* Add more details as needed */}
             </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )} 
        <Modal
          show={showDisapproveModal}
          onClose={() => setShowDisapproveModal(false)}
          popup
          size='md'
          className='z-50' // Ensure modal is above other content
        >
<Modal.Header />
<Modal.Body>
  <div className='text-center'>
    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
    <h3 className='mb-5 text-lg text-gray-500'>
      Are you sure you want to disapprove this listing?
    </h3>
    <div className='flex justify-center gap-4'>
      <Button color='success' onClick={handleDisapproveListing}>
        Yes, I am sure
      </Button>
      <Button color='gray' onClick={() => setShowDisapproveModal(false)}>
        No, cancel
      </Button>
    </div>
  </div>
</Modal.Body>
</Modal>
</div>
       
        
    );
};

export default DashboardListings;

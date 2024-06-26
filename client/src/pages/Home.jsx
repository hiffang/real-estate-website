import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import bgimage from '../assets/Untitled design (6).png'
import Loading from '../components/Loading';


export default function Home() {
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

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [hostelRes, singleRoomRes,sharedRoomRes, guesthouseRes, annexRes, bungalowRes, fullhouseholidayRes, fullhouserentRes] = await Promise.all([
          fetch('/api/listing/get?type=hostel&limit=4&status=approved'),
          fetch('/api/listing/get?type=singleroom&limit=4&status=approved'),
          fetch('/api/listing/get?type=sharedroom&limit=4&status=approved'),
          fetch('/api/listing/get?type=guesthouse&limit=4&status=approved'),
          fetch('/api/listing/get?type=annex&limit=4&status=approved'),
          fetch('/api/listing/get?type=bungalow&limit=4&status=approved'),
          fetch('/api/listing/get?type=fullhouseholiday&limit=4&status=approved'),
          fetch('/api/listing/get?type=fullhouserent&limit=4&status=approved')
        ]);

        if (!hostelRes.ok || !singleRoomRes.ok || !sharedRoomRes.ok || !guesthouseRes.ok || !annexRes.ok || !bungalowRes.ok || !fullhouseholidayRes.ok || !fullhouserentRes.ok ) {
          throw new Error('Failed to fetch listings');
        }

        const [ hostelData, singleRoomData,sharedRoomData, guesthouseData, annexData, bungalowData, fullhouseholidayData, fullhouserentData] = await Promise.all([
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
    <div>
      {/* Top section */}
      <div className='relative text-center stroke-black flex flex-col gap-6 p-10 md:p-20 lg:p-28 px-3 max-w-6xl mx-auto h-screen bg-cover bg-center'>
  <img src={bgimage} alt="" className="absolute inset-0 w-max h-full  transition-scale duration-300 object-cover z-0 " />
  <div className="relative z-10">
    <h1 className='text-white font-bold text-3xl md:text-5xl lg:text-6xl'>
      Find your next <span className='text-orange-500'>perfect</span>
      <br />
      place to <span className='text-red-500'>board.</span>
      <br />
      We have a <span className='text-yellow-300'>wide</span> range of properties
       <br />
      to suit <span className='text-green-400'>your</span> requirements!
    </h1>
    <div className='text-white font-bold py-2 text-sm md:text-base lg:text-lg'>
      <span className='text-red-400'>Bordima.lk</span>  is the best place to find your next perfect place to
      to have your stay.
      <br />
      We have a wide range of properties for you to choose from.
    </div>
    <Link to={'/search'}>
    <button className='bg-blue-500 text-white text-lg md:text-xl lg:text-2xl font-bold font-custom py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-200 inline-flex items-center justify-center animate-pulse-custom'>
      Let's get started...
    </button>
    </Link>
  </div>
</div>


      {/* Listing results for offer, sale, and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {singleRoomListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places with single rooms</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=singleroom'}>Show more single rooms...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {singleRoomListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{sharedRoomListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places with shared rooms</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sharedroom'}>Show more shared rooms...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {sharedRoomListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {hostelListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent hostels</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=hostel'}>Show more hostels...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {hostelListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        
{guesthouseListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Guest houses</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=guesthouse'}>Show more guest houses...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {guesthouseListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{annexListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Annexes</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=annex'}>Show more annexes...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {annexListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{bungalowListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Bungalows</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=bungalow'}>Show more bungalows...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {bungalowListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{fullhouseholidayListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent full houses for vacations</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=fullhouseholiday'}>Show more full houses for vacations...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {fullhouseholidayListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

{fullhouserentListings.length > 0 ? (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent full houses for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=fullhouserent'}>Show more full houses for rent...</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {fullhouserentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        
         <div className="bg-gray-200 text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Are you a property owner?</h2>
        <p className="text-lg mb-4">Create your listing now and reach thousands of potential guests!</p>
        <Link to="/create-listing">
          <button className="bg-blue-500 text-white text-lg font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-200">
            Create Listing
          </button>
        </Link>
      </div>
      </div>
    </div>
  );
}

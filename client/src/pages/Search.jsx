import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import ListingItem from '../components/ListingItem';
import districtsAndCities from '../assets/districtsandcities'; // Update path
import Loading from '../components/Loading';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation for current location
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    rentType: '',
    parking: false,
    furnished: false,
    kitchen: false,
    aircondition: false,
    hotwater: false,
    sort: 'rent',
    order: 'asc',
    district: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const kitchenFromUrl = urlParams.get('kitchen');
    const airconditionFromUrl = urlParams.get('aircondition');
    const hotwaterFromUrl = urlParams.get('hotwater');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    const districtFromUrl = urlParams.get('district');
    const cityFromUrl = urlParams.get('city');
    const rentTypeFromUrl = urlParams.get('rentType');
    const minPriceFromUrl = urlParams.get('minPrice');
    const maxPriceFromUrl = urlParams.get('maxPrice');

    setSidebardata((prev) => ({
      searchTerm: searchTermFromUrl || '',
      type: typeFromUrl || 'all',
      parking: parkingFromUrl === 'true' || false,
      furnished: furnishedFromUrl === 'true' || false,
      kitchen: kitchenFromUrl === 'true' || false,
      aircondition: airconditionFromUrl === 'true' || false,
      hotwater: hotwaterFromUrl === 'true' || false,
      sort: sortFromUrl || 'rent',
      order: orderFromUrl || 'asc',
      district: districtFromUrl || '',
      city: cityFromUrl || '',
      rentType: rentTypeFromUrl || '',
    }));

    setMinPrice(minPriceFromUrl || '');
    setMaxPrice(maxPriceFromUrl || '');

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      urlParams.set('sort', sidebardata.sort);
      urlParams.set('order', sidebardata.order);
      urlParams.set('status', 'approved');
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    if (selectedDistrict === '') {
      setSidebardata({
        ...sidebardata,
        district: '',
        city: '',
      });
      setCities([]);
    } else {
      setSidebardata({
        ...sidebardata,
        district: selectedDistrict,
        city: '',
      });
      setCities(districtsAndCities[selectedDistrict]);
    }
  };

  const handleCityChange = (e) => {
    setSidebardata({
      ...sidebardata,
      city: e.target.value,
    });
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (type === 'checkbox') {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (type === 'radio') {
      setSidebardata({ ...sidebardata, type: value });
    } else {
      setSidebardata({ ...sidebardata, [id]: value });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('kitchen', sidebardata.kitchen);
    urlParams.set('aircondition', sidebardata.aircondition);
    urlParams.set('hotwater', sidebardata.hotwater);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    urlParams.set('district', sidebardata.district);
    urlParams.set('city', sidebardata.city);
    urlParams.set('rentType', sidebardata.rentType);
    urlParams.set('minPrice', minPrice);
    urlParams.set('maxPrice', maxPrice);
    urlParams.set('status', 'approved'); // Ensure status is always approved
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    urlParams.set('status', 'approved'); // Ensure status is always approved
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label htmlFor='type'>Property Type</label>
            <select
              id='type'
              className='border p-3 rounded-lg'
              value={sidebardata.type}
              onChange={handleChange}
            >
              <option value='all'>All</option>
              <option value='hostel'>Hostel</option>
              <option value='singleroom'>Single Room</option>
              <option value='guesthouse'>Guest House</option>
              <option value='annex'>Annex</option>
              <option value='bungalow'>Bungalow</option>
              <option value='fullhouseholiday'>Full house for holiday</option>
              <option value='fullhouserent'>Full house for rent</option>
            </select>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
  <label htmlFor='rentType'>Rent Type</label>
  <select
    id='rentType'
    className='border p-3 rounded-lg'
    value={sidebardata.rentType}
    onChange={handleChange}
  >
    <option value=''>All</option>
    <option value='daily'>Daily</option>
    <option value='monthly'>Monthly</option>
    <option value='weekly'>Weekly</option>
  </select>
</div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Facilities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='form-checkbox'
                checked={sidebardata.parking}
                onChange={handleChange}
              />
              <label htmlFor='parking'>Parking</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='form-checkbox'
                checked={sidebardata.furnished}
                onChange={handleChange}
              />
              <label htmlFor='furnished'>Furnished</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='kitchen'
                className='form-checkbox'
                checked={sidebardata.kitchen}
                onChange={handleChange}
              />
              <label htmlFor='kitchen'>Kitchen</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='aircondition'
                className='form-checkbox'
                checked={sidebardata.aircondition}
                onChange={handleChange}
              />
              <label htmlFor='aircondition'>Air Condition</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='hotwater'
                className='form-checkbox'
                checked={sidebardata.hotwater}
                onChange={handleChange}
              />
              <label htmlFor='hotwater'>Hot Water</label>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label htmlFor='district'>District</label>
            <select
              id='district'
              className='border p-3 rounded-lg'
              value={sidebardata.district}
              onChange={handleDistrictChange}
            >
              <option value=''>All Districts</option>
              {Object.keys(districtsAndCities).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label htmlFor='city'>City</label>
            <select
              id='city'
              className='border p-3 rounded-lg'
              value={sidebardata.city}
              onChange={handleCityChange}
              disabled={cities.length === 0}
            >
              <option value=''>All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label htmlFor='sort_order'>Sort By</label>
            <select
              id='sort_order'
              className='border p-3 rounded-lg'
              value={`${sidebardata.sort}_${sidebardata.order}`}
              onChange={handleChange}
            >
              <option value='rent_asc'>Price: Low to High</option>
              <option value='rent_desc'>Price: High to Low</option>
              <option value='createdAt_desc'>Newest First</option>
              <option value='createdAt_asc'>Oldest First</option>
              
              
            </select>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label htmlFor='minPrice'>Min Price</label>
            <input
              type='number'
              id='minPrice'
              className='border p-3 rounded-lg w-full'
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <label htmlFor='maxPrice'>Max Price</label>
            <input
              type='number'
              id='maxPrice'
              className='border p-3 rounded-lg w-full'
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='bg-gray-800 text-white rounded-lg p-3'
          >
            Search
          </button>
        </form>
      </div>
      <div className='p-7 w-full'>
        {loading ? (
          <Loading />
        ) : listings.length === 0 ? (
          <p>No listings found</p>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
            {showMore && (
              <div className='flex justify-center mt-6'>
                <button
                  className='bg-gray-800 text-white rounded-lg p-3'
                  onClick={onShowMoreClick}
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

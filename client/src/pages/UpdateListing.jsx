import { useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import districtsAndCities from '../assets/districtsandcities';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function UpdateLisitng() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    rules: '',
    address: '',
    district: '',
    city: '',
    type: 'sharedroom',
    bedrooms: 0,
    bathrooms: 0,
    beds: 0,
    rent: '',
    parking: false,
    furnished: false,
    kitchen: false,
    hotwater:false,
    aircondition:false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [contactNumber, setContactNumber] = useState(currentUser.contactNumber || '');
  const [contactError, setContactError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);
  
  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
          setImageUploadError('Each image must be less than 5 MB');
          setUploading(false);
          return;
        }
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
          setFiles([]); // Clear files after upload
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload up to 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    
    if (type === 'radio' && name === 'type') {
      setFormData({
        ...formData,
        type: value,
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };
  


  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    if (selectedDistrict === '') {
      formData({
        ...formData,
        district: '',
        city: '',
      });
      setCities([]);
    } else {
      setFormData({
        ...formData,
        district: selectedDistrict,
        city: '',
      });
      setCities(districtsAndCities[selectedDistrict]);
    }
  };

  const handleCityChange = (e) => {
    setFormData({
      ...formData,
      city: e.target.value,
    });
  };

  const handleContactChange = async (e) => {
    e.preventDefault();
    setUpdating(true); // Set updating state to true at the start of the update process

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdating(false); // Reset updating state on failure
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    } finally {
      setUpdating(false); // Ensure updating state is reset after the operation completes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.address ||
      formData.imageUrls.length < 1
    ) {
      setError('Please fill in all required fields and upload at least one image');
      return;
    }
    if (formData.rent <= 0) {
      setError('Rent must be a positive number');
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        // Redirect to the newly created listing page
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-7xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-x-2 sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Title'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <textarea
            placeholder='Terms(optional)'
            className='border p-3 rounded-lg'
            id='rules'
            
            onChange={handleChange}
            value={formData.rules}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex flex-col gap-4'>
            <label htmlFor='district'>District</label>
            <select
              id='district'
              className='border p-3 rounded-lg'
              value={formData.district}
              onChange={handleDistrictChange}
              required
            >
              <option value=''>Select District</option>
              {Object.keys(districtsAndCities).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-4'>
            <label htmlFor='city'>City</label>
            <select
              id='city'
              className='border p-3 rounded-lg'
              value={formData.city}
              onChange={handleCityChange}
              required
              disabled={!formData.district}
            >
              <option value=''>Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-4'>
            <label htmlFor='type'>Property Type</label>
            <select
              id='type'
              className='border p-3 rounded-lg'
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value='hostel'>Hostel</option>
              <option value='singleroom'>Single Room</option>
              <option value='sharedroom'>Shared Room</option>
              <option value='guesthouse'>Guest House</option>
              <option value='annex'>Annex</option>
              <option value='bungalow'>Bungalow</option>
              <option value='fullhouseholiday'>Full house for holiday</option>
              <option value='fullhouserent'>Full house for rent</option>
            </select>
          </div>
          <div className='flex flex-col gap-4'>
            <label htmlFor='rentType'>Rent Basis</label>
            <select
              id='rentType'
              className='border p-3 rounded-lg'
              value={formData.rentType}
              onChange={handleChange}
              required
            >
              <option value='weekly'>Weekly</option>
              <option value='monthly'>Monthly</option>
              <option value='daily'>Daily</option>
            </select>
            </div>
         
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='parking'
              className='w-5'
              onChange={handleChange}
              checked={formData.parking}
            />
            <span>Parking spot</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='furnished'
              className='w-5'
              onChange={handleChange}
              checked={formData.furnished}
            />
            <span>Furnished</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='kitchen'
              className='w-5'
              onChange={handleChange}
              checked={formData.kitchen}
            />
            <span>Kitchen</span>
          </div>
          <div className='flex gap-2'>
            <input
              type='checkbox'
              id='hotwater'
              className='w-5'
              onChange={handleChange}
              checked={formData.hotwater}
            />
            <span>Hot water</span>
          </div>
          <div className='flex gap-2 mb-3'>
            <input
              type='checkbox'
              id='aircondition'
              className='w-5'
              onChange={handleChange}
              checked={formData.aircondition}
            />
            <span>Air conditioning</span>
          </div>
        </div>

        <div className='flex flex-col mx-4 gap-4'>
          <label htmlFor='contactNumber' className='font-bold'>
            Contact Number:
          </label>
          <input
            type='phonenumber'
            placeholder='Phone Number'
            onChange={handleChange}
            id='number'
            defaultValue={currentUser.number}
            className='border p-3 rounded-lg'
          />
          {contactError && <p className='text-red-500'>{contactError}</p>}
          <div className='mt-1 text-green-500'>
            <p>
              Is this your correct contact number? If not, please update it
              above.
            </p>
          </div>
          <button
              type='button'
              disabled={updating}
              onClick={handleContactChange}
              className='p-3 text-white bg-green-700 border-white rounded uppercase hover:shadow-lg '>
               {updating? 'Updating...':'Update'}
               
              </button>
              {updateSuccess && <p className='text-green-600'>Updated Successfully!</p>}
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='border border-gray-300 p-3 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className={`p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg ${
                uploading ? 'opacity-80' : ''
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))} 
{(formData.type === 'guesthouse' || formData.type === 'annex' || formData.type === 'bungalow' || formData.type === 'fullhouseholiday' || formData.type === 'fullhouserent') && (
  <div className='flex items-center gap-2'>
    <input
      type='number'
      id='bedrooms'
      min='1'
      max='10'
      required
      className='p-3 border border-gray-300 rounded-lg'
      onChange={handleChange}
      value={formData.bedrooms}
    />
    <p>Bedrooms</p>
  </div>
)}

{(formData.type === 'singleroom' || formData.type === 'sharedroom' || formData.type === 'hostel') && (
  <div className='flex items-center gap-2'>
    <input
      type='number'
      id='beds'
      min='1'
      max='10'
      required
      className='p-3 border border-gray-300 rounded-lg'
      onChange={handleChange}
      value={formData.beds}
    />
    <p>Beds per room</p>
  </div>
)}
          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='bathrooms'
              min='1'
              max='10'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <p>Bathrooms</p>
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='rent'
              min='50'
              max='10000000'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={formData.rent}
            />
            <div>
              <p>Rent</p>
              <span className='text-xs'>(Rs./{formData.rentType})</span>
            </div>
          </div>
          
        </div>

       
         
        

      </form>
      <button
        disabled={loading || uploading}
        className={`p-3 bg-slate-700 flex flex-col text-white rounded-lg uppercase hover:opacity-95 mx-auto mb-3 mt-4 max-w-fit`}
        onClick={handleSubmit}
      >
        {loading ? 'Updating...' : 'Update listing'}
      </button>
      {error && <p className='text-red-700 text-sm text-center'>{error}</p>}
    </main>
  );
}

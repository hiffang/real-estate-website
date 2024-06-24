import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <a href={`tel:${landlord.number}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Call Advertiser
          </a>
          <Link
      to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
      className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
      >
        Send E-mail       
      </Link>
        </div>
      )}
    </>
  );
}

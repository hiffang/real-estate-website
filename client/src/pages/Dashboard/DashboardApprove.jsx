import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Loading from '../../components/Loading';

export default function DashboardApprove() {
  const { currentUser } = useSelector((state) => state.user);
  const [PendingListings, setPendingListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [listingIdToDelete, setListingIdToDelete] = useState('');
  const [listingIdToApprove, setListingIdToApprove] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`/api/listing/pending`);
        const data = await res.json();
        if (res.ok) {
          setPendingListings(data || []);
        } else {
          console.error('Failed to fetch listings:', data.message);
        }
      } catch (error) {
        console.error('Error fetching listings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchPending();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleDeleteListing = async () => {
    try {
      const res = await fetch(`/api/listing/delete/${listingIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setPendingListings((prev) => prev.filter((listing) => listing._id !== listingIdToDelete));
        setShowModal(false);
      } else {
        console.error('Failed to delete listing:', data.message);
      }
    } catch (error) {
      console.error('Error deleting listing:', error.message);
    }
  };

  const handleApproveListing = async () => {
    try {
      const res = await fetch(`/api/listing/approve/${listingIdToApprove}`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (res.ok) {
        setPendingListings((prev) =>
          prev.filter((listing) => listing._id !== listingIdToApprove)
        );
        setShowApproveModal(false);
      } else {
        console.error('Failed to approve listing:', data.message);
      }
    } catch (error) {
      console.error('Error approving listing:', error.message);
    }
  };
  

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='table-auto text-black overflow-x-auto mx-auto p-3'>
        {currentUser && currentUser.isAdmin && PendingListings.length > 0 ? (
          <>
            <table className='shadow-md w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='text-xs uppercase text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3'>Date created</th>
                  <th className='px-6 py-3'>Image</th>
                  <th className='px-6 py-3'>Title</th>
                  <th className='px-6 py-3'>Approve</th>
                  <th className='px-6 py-3'>Delete</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {PendingListings.map((listing) => (
                  <tr className='bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600' key={listing._id}>
                    <td className='px-6 py-4 text-white'>{new Date(listing.createdAt).toLocaleDateString()}</td>
                    <td className='px-6 py-4'>
                      <img
                        src={listing.imageUrls || '/fallback-image.png'}
                        alt={listing.name}
                        className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                      />
                    </td>
                    <td className='px-6 py-4 text-white'>{listing.name}</td>
                    <td className='px-6 py-4'>
                      <button
                        type='button'
                        className='text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2'
                        onClick={() => {
                          setShowApproveModal(true);
                          setListingIdToApprove(listing._id);
                        }}
                      >
                        Approve
                      </button>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setListingIdToDelete(listing._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No pending listings yet!</p>
        )}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size='md'
          className='z-50' // Ensure modal is above other content
        >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-500'>
                Are you sure you want to delete this listing?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteListing}>
                  Yes, I am sure
                </Button>
                <Button color='gray' onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          popup
          size='md'
           // Ensure modal is above other content
        >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-500'>
                Are you sure you want to approve this listing?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='success' onClick={handleApproveListing}>
                  Yes, I am sure
                </Button>
                <Button color='gray' onClick={() => setShowApproveModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

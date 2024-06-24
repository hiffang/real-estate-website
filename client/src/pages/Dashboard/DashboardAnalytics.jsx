import { useEffect, useState } from 'react';

const DashboardAnalytics = () => {
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    const fetchTotalListings = async () => {
      try {
        const response = await fetch('/api/listing/get-total', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const text = await response.text();
        console.log('Raw response:', text);

        if (!response.ok) {
          throw new Error(`Failed to fetch total listings: ${response.status} ${response.statusText}`);
        }

        const data = JSON.parse(text);
        console.log('Parsed JSON:', data);

        setTotalListings(data.totalListings);
      } catch (error) {
        console.error('Error fetching total listings:', error);
      }
    };

    fetchTotalListings();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">User Analytics</h1>
        <p className="text-lg">Total Number of Listings: <span className="font-semibold">{totalListings}</span></p>
      </div>
    </div>
  );
};

export default DashboardAnalytics;

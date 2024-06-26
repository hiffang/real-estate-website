import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-8 justify-between items-start">
          {/* Contact Us */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <ul className="text-sm">
              <li>Phone: +94713457947</li>
              <li>Email: support@bordima.lk</li>
              
            </ul>
          </div>
          
          {/* Social Media */}
          <div className="w-full md:w-1/3 text-right sm:mx-1">
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <ul className="text-sm">
              <li><a href="https://facebook.com/yourcompany" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com/yourcompany" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              {/* Add more social media links as needed */}
            </ul>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Bordima.lk. All rights reserved.</p>
          <p className="mt-2 text-sm"><Link to='/terms'>Terms of Service</Link> | <Link to="/privacy">Privacy Policy</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SLBFRegistrations</h3>
            <p className="text-gray-300">
              Register players, manage profiles, and connect through one platform.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/players" className="hover:text-white">Players</a></li>
              {/* <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li> */}
            </ul>
          </div>
          {/* <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="text-gray-300 space-y-2">
              <p>Email: info@sportsplatform.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Sports Ave, City, State</p>
            </div>
          </div> */}
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
          <p>&copy; 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

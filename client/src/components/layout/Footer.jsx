import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="relative bg-gradient-to-r from-[#0f172a] to-[#1a1a1a] text-white px-6 py-10 mt-10 z-50 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Liquor HUB</h2>
          <p>Your one-stop shop for quality spirits.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/policy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <p>Email: info@liquorhub.com</p>
          <p>Phone: +977-123456789</p>
        </div>

        {/* Socials */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4 text-xl">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="mailto:info@liquorhub.com"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-600" />
      <p className="text-center text-xs text-gray-400">&copy; {new Date().getFullYear()} Shirish. All rights reserved.</p>
    </div>
  );
};

export default Footer;

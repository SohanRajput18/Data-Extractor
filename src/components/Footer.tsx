import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-3 px-6">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} Modaka Technologies Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
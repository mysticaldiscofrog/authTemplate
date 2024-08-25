import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Your Logo</div>
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search the knowledge of the world..."
            className="w-full p-2 rounded"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

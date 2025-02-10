import React from "react";

const Header = () => {
  return (
    <header className="sticky z-20 top-0 w-full bg-white/10 backdrop-blur-md shadow-lg border-b border-gray-600 py-4">
      <div className="max-w-6xl mx-auto px-6 flex justify-center">
        <h1 className="text-white text-4xl font-extrabold tracking-wide">
          <span className="text-[#00f5d4]">Shree Sai</span> Library
        </h1>
      </div>
    </header>
  );
};

export default Header;

import React from "react";

const Logo: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md shadow-black/70 
                 animate-pulse-slow hover:scale-110 transition-transform duration-300"
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black shadow-inner shadow-black/30 
                   transition-all duration-300"
      >
        <span
          className="text-white text-xs select-none"
          style={{ fontFamily: "Chakra Petch, sans-serif", fontWeight: 1000 }}
        >
          ex
        </span>
      </div>
    </div>
  );
};

export default Logo;
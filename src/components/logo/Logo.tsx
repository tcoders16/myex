import React from "react";

const Logo: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-white shadow-md shadow-black/70 
                 animate-pulse-slow hover:scale-110 transition-transform duration-300
                 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
    >
      <div
        className="flex items-center justify-center rounded-full bg-black shadow-inner shadow-black/30 
                   transition-all duration-300 
                   w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
      >
        <span
          className="text-white select-none"
          style={{
            fontFamily: "Chakra Petch, sans-serif",
            fontWeight: 1000,
            fontSize: "clamp(0.55rem, 1.2vw, 1rem)", // even smaller text scale
          }}
        >
          ex
        </span>
      </div>
    </div>
  );
};

export default Logo;
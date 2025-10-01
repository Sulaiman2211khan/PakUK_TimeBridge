import React, { useState, useEffect } from 'react';

interface ClockProps {
  city: string;
  country: string;
  timeZone: string;
  countryCode: string;
}

const Clock: React.FC<ClockProps> = ({ city, country, timeZone, countryCode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="group relative p-6 rounded-2xl bg-white/30 dark:bg-gray-900/40 backdrop-blur-lg border border-white/20 shadow-2xl shadow-gray-600/10 dark:shadow-black/20 transition-all duration-300 hover:scale-[1.02] hover:border-white/30">
      <div className="flex items-center justify-center text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
        <img 
            src={`https://flagsapi.com/${countryCode}/shiny/32.png`}
            alt={`${country} flag`}
            className="w-8 h-8 mr-3 object-contain"
        />
        <span>{city}, {country}</span>
      </div>
      <div className="text-5xl sm:text-6xl font-mono font-bold tracking-wider text-gray-800 dark:text-white bg-black/5 dark:bg-white/10 px-4 py-2 rounded-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
        {formattedTime}
      </div>
    </div>
  );
};

export default Clock;
import React, { useState, useEffect } from 'react';

const ElectionCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2027-08-10T00:00:00+03:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border-l-8 border-green-600 relative overflow-hidden w-full h-full flex flex-col justify-between">
      <h2 className="text-sm md:text-base font-extrabold text-green-800 uppercase tracking-widest mb-4">
        ROAD TO 2027: GENERAL ELECTIONS
      </h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="bg-gray-50 border border-gray-100 rounded-xl p-2 sm:p-4 flex flex-col justify-center shadow-inner">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">
              {value.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold mt-1">
              {unit}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs font-medium text-gray-400 mt-4 italic text-right">
        The Youth League is mobilizing. Every second counts.
      </p>
    </div>
  );
};

export default ElectionCountdown;

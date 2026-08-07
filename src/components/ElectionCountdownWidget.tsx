import React, { useState, useEffect } from 'react';

export const ElectionCountdownWidget: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2027-08-10T00:00:00+03:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: String(timeLeft.days) },
    { label: 'Hours', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Minutes', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border-l-8 border-green-600 relative overflow-hidden my-8 max-w-5xl mx-auto">
      {/* Header */}
      <h3 className="text-sm md:text-base font-extrabold text-green-800 uppercase tracking-widest mb-4">
        ROAD TO 2027: GENERAL ELECTIONS
      </h3>

      {/* Countdown Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="bg-gray-50 border border-gray-100 rounded-xl p-2 sm:p-4 flex flex-col justify-center shadow-inner"
          >
            <span className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">
              {unit.value}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Urgency/Action Element */}
      <div className="text-right">
        <p className="text-xs font-medium text-gray-400 mt-4 italic">
          The Youth League is mobilizing. Every second counts.
        </p>
      </div>
    </div>
  );
};

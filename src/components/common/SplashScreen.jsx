import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, ShieldCheck } from 'lucide-react';

export function SplashScreen({ onFinish, duration = 1600 }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 20;
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    const timeout = setTimeout(() => {
      handleComplete();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [duration]);

  const handleComplete = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md text-white transition-opacity duration-300 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        
        {/* Pulsating Blood Drop Icon */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute w-16 h-16 rounded-full bg-rose-500/30 animate-pulse" />
          
          <div
            className="w-14 h-14 bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 flex items-center justify-center shadow-xl shadow-rose-600/50 transform -rotate-45 cursor-pointer hover:scale-105 transition-transform"
            style={{ borderRadius: '50% 0 50% 50%' }}
            onClick={handleComplete}
            title="Click to enter immediately"
          >
            <Heart className="w-7 h-7 text-white transform rotate-45 fill-white animate-bounce" style={{ animationDuration: '1.2s' }} />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
          Blood<span className="text-rose-500">Connect</span>
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-300 font-medium mb-4">
          Fast matching. Safer sharing. Better coordination.
        </p>

        {/* Privacy Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-rose-300 border border-slate-700 text-xs font-semibold mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>Privacy-Preserving Blood Network</span>
        </div>

        {/* Progress Bar */}
        <div className="w-56 h-1 bg-slate-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Enter / Skip Button */}
        <button
          onClick={handleComplete}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Continue to Home Page</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

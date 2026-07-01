import React from 'react';

interface LogoProps {
  className?: string;
}

export default function SttNfLogo({ className = 'h-16 w-16' }: LogoProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="https://upload.wikimedia.org/wikipedia/id/6/68/Logo-STTNF.png"
        alt="Logo STT-NF"
        className={`${className} object-contain select-none`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

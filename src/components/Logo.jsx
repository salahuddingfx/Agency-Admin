import React from 'react';

export default function Logo({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-bg-grad-admin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18B7F5" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <mask id="logo-circle-mask-admin">
          <circle cx="50" cy="50" r="40" fill="#FFFFFF" />
        </mask>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="40" fill="url(#logo-bg-grad-admin)" />
      {/* Interlocking white path */}
      <path
        d="M 10 55 L 32 55 C 36 55, 38 34, 42 34 C 48 34, 52 66, 58 66 C 62 66, 64 45, 68 45 L 90 45"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        mask="url(#logo-circle-mask-admin)"
      />
    </svg>
  );
}

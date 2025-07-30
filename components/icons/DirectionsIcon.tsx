import React from 'react';

const DirectionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M6.194 6.194a.75.75 0 011.06 0L16 14.939V10.5a.75.75 0 011.5 0v5.25a.75.75 0 01-.75.75H11.5a.75.75 0 010-1.5h4.439L7.254 7.254a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

export default DirectionsIcon;

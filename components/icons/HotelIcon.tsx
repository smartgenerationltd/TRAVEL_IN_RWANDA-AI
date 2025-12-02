import React from 'react';

const HotelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 3.75A.75.75 0 015.25 3h13.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V3.75zM8.25 7.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 4.5a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm3-4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V7.5a.75.75 0 01.75-.75zm3 .75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z" clipRule="evenodd" />
  </svg>
);

export default HotelIcon;

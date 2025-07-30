
import React from 'react';

const BankIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M12.75 1.75a.75.75 0 00-1.5 0V3h-3V1.75a.75.75 0 00-1.5 0V3h-2.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h12.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75H15V1.75a.75.75 0 00-2.25 0z" />
    <path fillRule="evenodd" d="M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v10.5A2.25 2.25 0 0118 21.75H6A2.25 2.25 0 013.75 19.5V8.25zm1.5.75v10.5a.75.75 0 00.75.75h12a.75.75 0 00.75-.75V9H4.5z" clipRule="evenodd" />
    <path d="M11.25 12.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" />
  </svg>
);

export default BankIcon;

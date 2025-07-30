
import React from 'react';

const CreditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.255 3.32a.75.75 0 00-1.07-1.07L7.66 8.16a.75.75 0 00-.22.53v4.44c0 .513.67 1.013 1.16.822l4.24-1.63a.75.75 0 00.53-.22l3.66-3.66a.75.75 0 00-1.07-1.07L12.255 10.5l-2.06-2.06 2.06-2.06z" clipRule="evenodd" />
  </svg>
);

export default CreditIcon;

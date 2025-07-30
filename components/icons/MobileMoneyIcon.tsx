
import React from 'react';

const MobileMoneyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M17.25 2.25H6.75a3 3 0 00-3 3v13.5a3 3 0 003 3h10.5a3 3 0 003-3V5.25a3 3 0 00-3-3zM6.75 21a1.5 1.5 0 01-1.5-1.5V18h13.5v1.5a1.5 1.5 0 01-1.5 1.5H6.75zM18.75 9a.75.75 0 00-.75-.75H6a.75.75 0 000 1.5h12a.75.75 0 00.75-.75z" />
    <path d="M12.551 11.23a1.5 1.5 0 011.664 1.116l.243.811a1.5 1.5 0 01-2.83 1.025l-.243-.811a1.5 1.5 0 011.166-1.141zM11 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

export default MobileMoneyIcon;

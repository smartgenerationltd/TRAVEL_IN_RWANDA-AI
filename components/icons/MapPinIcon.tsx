import React from 'react';

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path fillRule="evenodd" d="M21.75 10.5c0 6.467-9.75 11.25-9.75 11.25S2.25 16.967 2.25 10.5a9.75 9.75 0 0119.5 0zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
);

export default MapPinIcon;

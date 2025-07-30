
import React from 'react';

const RwandaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
        <rect fill="#20603d" width="900" height="600" />
        <rect fill="#fad201" width="900" height="450" />
        <rect fill="#00a1de" width="900" height="300" />
        <g fill="#fad201">
            <g id="d">
                <g id="c">
                    <g id="b">
                        <path id="a" d="M0-12L3.7-3.7 0-5z" />
                        <use href="#a" transform="scale(-1,1)" />
                    </g>
                    <use href="#b" transform="rotate(45)" />
                </g>
                <use href="#c" transform="rotate(90)" />
            </g>
            <use href="#d" transform="translate(750 150) scale(4.1666665)" />
        </g>
    </svg>
);

export default RwandaIcon;

import React from 'react';
import HotelIcon from './icons/HotelIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import { huyeHotelsData as hotelData } from '../data/huyeHotelsData';


const SourceTag: React.FC<{ source: string }> = ({ source }) => {
    const [name, value] = source.split('+');
    return (
        <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 mr-1.5 mb-1.5">
            {name.trim()}
            {value && <span className="ml-1 opacity-70">+{value.trim()}</span>}
        </span>
    );
};

const HuyeHotels: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <header className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <HotelIcon className="h-6 w-6 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hotels in Huye (Butare) – Contact Details</h2>
            </header>

            <div className="p-4 md:p-6 space-y-4">
                {hotelData.map((hotel, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-shadow hover:shadow-md">
                        <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">{hotel.name}</h3>
                        {hotel.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">{hotel.description}</p>}
                        
                        <div className="my-3 space-y-2">
                            {hotel.phone && hotel.phone.length > 0 && (
                                <div className="flex items-start space-x-2">
                                    <PhoneIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        {hotel.phone.join(' · ')}
                                    </div>
                                </div>
                            )}
                            {hotel.email && (
                                <div className="flex items-start space-x-2">
                                    <EmailIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{hotel.email}</span>
                                </div>
                            )}
                        </div>
                        
                        {hotel.sources && hotel.sources.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                                {hotel.sources.map((src, i) => <SourceTag key={i} source={src} />)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HuyeHotels;

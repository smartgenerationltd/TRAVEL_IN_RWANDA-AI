import React from 'react';
import HotelIcon from './icons/HotelIcon';
import MapPinIcon from './icons/MapPinIcon';
import { volcanoesHotelsData as hotelData } from '../data/volcanoesHotelsData';

const SourceTag: React.FC<{ source: string }> = ({ source }) => {
    const [name, value] = source.split('+');
    return (
        <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 mr-1.5 mb-1.5">
            {name.trim()}
            {value && <span className="ml-1 opacity-70">+{value.trim()}</span>}
        </span>
    );
};

const HotelCategory: React.FC<{title: string, hotels: typeof hotelData.luxury}> = ({ title, hotels }) => (
    <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {hotels.map((hotel, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-shadow hover:shadow-md">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">{hotel.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">{hotel.description}</p>
                    <div>
                        {hotel.sources.map((src, i) => <SourceTag key={i} source={src} />)}
                    </div>
                </div>
            ))}
        </div>
    </section>
);


const VolcanoesHotels: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <header className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
            <HotelIcon className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Hotels & Lodges: Volcanoes National Park</h2>
        </header>

        <div className="p-6 space-y-6">
            <HotelCategory title="Luxury & Upscale" hotels={hotelData.luxury} />
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            <HotelCategory title="Mid-Range & Comfortable" hotels={hotelData.midRange} />
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            <HotelCategory title="Budget & Guesthouses" hotels={hotelData.budget} />
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            
            <section>
                 <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Where They’re Located</h3>
                 <div className="space-y-4">
                    {hotelData.locations.map((loc, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start space-x-4">
                            <MapPinIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-green-700 dark:text-green-400">{loc.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">{loc.description}</p>
                                <div>
                                    {loc.sources.map((src, i) => <SourceTag key={i} source={src} />)}
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </section>
        </div>
    </div>
  );
};

export default VolcanoesHotels;

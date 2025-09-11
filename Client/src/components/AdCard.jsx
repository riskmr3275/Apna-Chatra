import React from 'react';

const AdCard = ({
    title = "विज्ञापन",
    image = "/ad.webp",
    description = "यहाँ आपका विज्ञापन हो सकता है",
    link = "#",
    sponsor = "प्रायोजित"
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4">
            {/* Ad Label */}
            <div className="bg-gray-100 px-3 py-1 text-xs text-gray-600 text-center border-b">
                {sponsor}
            </div>

            <div className="p-4">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-32 object-cover rounded mb-3"
                />

                <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
                    {title}
                </h3>

                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                    {description}
                </p>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-red-600 text-white text-center py-2 px-3 rounded text-xs font-medium hover:bg-red-700 transition-colors"
                >
                    और जानें
                </a>
            </div>
        </div>
    );
};

export default AdCard;
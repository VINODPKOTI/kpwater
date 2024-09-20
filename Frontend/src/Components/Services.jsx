// src/components/Services.js
import React from 'react';

const Services = () => {
    return (
        <div className="p-8 max-w-3xl mx-auto text-center "  id="Services">
            <h1 className="text-3xl font-bold mb-6  underline ">Our Services</h1>
            <div className="space-y-6">
                <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-emerald-600">
                    <h2 className="text-2xl font-semibold mb-2">Water Supply</h2>
                    <p className="text-lg">
                        We provide reliable and timely water supply services for homes and businesses. Our team ensures that you have access to clean and safe water at all times.
                    </p>
                </div>
                <div className=" p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-emerald-600">
                    <h2 className="text-2xl font-semibold mb-2">Newspaper Vending to Home</h2>
                    <p className="text-lg">
                        Enjoy the convenience of having your daily newspaper delivered right to your doorstep. We offer timely and reliable newspaper vending services to keep you updated with the latest news.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Services;

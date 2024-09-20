// src/components/About.js
import React from 'react';

const About = () => {
    return (
        <div className="p-8 max-w-3xl mx-auto text-center" >
            <h1 className="text-3xl font-bold mb-4 underline ">About</h1>
            <div className="space-y-6">
                <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-emerald-600">
                    <h2 className="text-2xl font-semibold mb-2">Water Supply</h2>
                    <p className="text-lg">
                        We provide reliable and timely water supply services for homes and businesses. Our team ensures that you have access to clean and safe water at all times.
                    </p>
                </div>
                </div>
        </div>
    );
};

export default About;

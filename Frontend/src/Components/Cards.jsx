import React, { useState } from 'react';
import bisleri from "../assets/bisleri_waterbottle.webp";
import mineral from "../assets/Mineral_water_bottle.png";


const Cards = () => {
  // State to track if the item is added to cart
  const [addedToCart, setAddedToCart] = useState({
    bisleri: false,
    mineral: false,
  });

  // Handler for toggling items in the cart
  const handleToggleCart = (item) => {
    setAddedToCart(prevState => ({
      ...prevState,
      [item]: !prevState[item]
    }));
  };

  return (
    <>
      {/* Header for the section */}
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-4 underline">Order Now</h1>
      </div>

      {/* Cards start here */}
      <div className="cards_list m-5 flex justify-center space-x-4 lg:h-full">
        {/* First Card */}
        
        <div className="w-full max-w-sm bg-gray-800 border border-gray-700 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg shadow">
            <img
              className="p-8 rounded-t-lg"
              src={bisleri}
              alt="product image"
            />
        
          <div className="px-5 pb-5">
          
              <h5 className="text-xl font-semibold tracking-tight text-gray-100 dark:text-gray-100 text-center">
                Bisleri Water Can (20 Litre)
              </h5>
           
            <div className="flex flex-col items-center justify-between">
              <span className="text-2xl font-bold text-gray-100 dark:text-gray-100 mr-2">₹100</span>
              <button
                onClick={() => handleToggleCart('bisleri')}
                className={`text-white ${addedToCart.bisleri ? 'bg-purple-500' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm m-2 px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300`}
              >
                {addedToCart.bisleri ? 'Added to Cart' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow bg-gradient-to-r from-blue-600 to-emerald-600">
         
            <img
              className="p-8 rounded-t-lg"
              src={mineral}
              alt="product image"
            />
       
          <div className="px-5 pb-5">
       
              <h5 className="text-xl font-semibold tracking-tight text-gray-100 dark:text-gray-100 text-center">
                Mineral Water Can (20 Litre)
              </h5>
       
            <div className="flex flex-col items-center justify-between">
              <span className="text-2xl font-bold text-gray-100 dark:text-gray-100 mr-2">₹40</span>
              <button
                onClick={() => handleToggleCart('mineral')}
                className={`text-white ${addedToCart.mineral ? 'bg-purple-500' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm m-2 px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300`}
              >
                {addedToCart.mineral ? 'Added  to Cart' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Cards end here */}
    </>
  );
}

export default Cards;

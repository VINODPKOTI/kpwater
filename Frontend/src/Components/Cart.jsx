import React, { useState, useEffect } from "react";
import bisleri from "../assets/bisleri_waterbottle.webp";
import mineral from "../assets/Mineral_water_bottle.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [quantities, setQuantities] = useState({
    bisleri: localStorage.getItem("bisleri")
      ? parseInt(localStorage.getItem("bisleri"), 10)
      : 0,  
    mineral: localStorage.getItem("mineral")
      ? parseInt(localStorage.getItem("mineral"), 10)
      : 0,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated by verifying userId in localStorage
    const userId = localStorage.getItem("userID"); // Check for userId if no token
    // console.log("User ID from localStorage:", userId); // Debugging log
  
    if (userId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  

  const handleQuantityChange = (item, quantity) => {
    const updatedQuantities = {
      ...quantities,
      [item]: parseInt(quantity, 10),
    };
    setQuantities(updatedQuantities);
    // Save the updated quantities to localStorage
    localStorage.setItem(item, quantity);
  };

  const prices = {
    bisleri: 100,
    mineral: 40,
  };

  const totalAmount =
    quantities.bisleri * prices.bisleri + quantities.mineral * prices.mineral;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("You need to sign in to proceed to checkout.");
      navigate("/signin"); // Redirect to Sign In page if not authenticated
    } else {
      const userId = localStorage.getItem("userID"); // Retrieve userId after login

      if (!userId) {
        alert("User ID not found. Please log in again.");
        navigate("/signin");
        return;
      }

      // Prepare the order data to be sent to the backend
      const orderData = {
        userId: userId,
        itemOrdered:
          quantities.bisleri && quantities.mineral
            ? `${quantities.bisleri} Bisleri and  ${quantities.mineral} Mineral`
            : quantities.bisleri
            ? `${quantities.bisleri} Bisleri"`
            : `${quantities.mineral} Mineral`,
        numBottles: `${quantities.bisleri}B${quantities.mineral}M`, // Example: 3B2M
        transactionStatus: "pending",
      };
      // console.log(`${quantities.bisleri}B${quantities.mineral}M`);

      // Post the order data to the backend API
      axios
        .post("http://localhost:8081/create-order", orderData)
        .then((response) => {
          alert("Your order has been placed successfully!");
          // Clear order from localStorage and reset the state
          localStorage.removeItem("bisleri");
          localStorage.removeItem("mineral");
          setQuantities({ bisleri: 0, mineral: 0 });
          navigate("/orders"); // Redirect to Orders page after successful order placement
        })
        .catch((error) => {
          console.error("Error placing the order:", error);
          alert("There was an error placing your order. Please try again.");
        });
    }
  };

  return (
    <>
      <div className="flex justify-center items-center shadow-md m-4 p-4">
        <div className="w-full max-w-3xl shadow-md rounded-lg px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between border-b pb-6 mb-6">
            <h1 className="font-semibold text-xl md:text-2xl">Buy</h1>
            <h2 className="font-semibold text-lg md:text-2xl">2 Items</h2>
          </div>

          <div className="flex flex-col space-y-6">
            {/* First Item */}
            <div className="flex flex-row items-center border-b border-gray-200 pb-6">
              <div className="flex-shrink-0 w-20 h-28 md:w-24 md:h-32 flex justify-center">
                <img
                  src={bisleri}
                  alt="Water Bottle"
                  className="w-full h-full object-center object-cover"
                />
              </div>

              <div className="flex-1 px-4">
                <p className="text-base font-black leading-none text-gray-800">
                  Bisleri Water Can
                </p>
                <p className="text-sm font-black leading-3 text-gray-800">
                  Price : ₹100
                </p>
              </div>

              <div className="flex-shrink-0">
                <select
                  value={quantities.bisleri}
                  onChange={(e) =>
                    handleQuantityChange("bisleri", e.target.value)
                  }
                  className="py-2 px-1 border border-gray-200"
                >
                  <option value="0">00</option>
                  <option value="1">01</option>
                  <option value="2">02</option>
                  <option value="3">03</option>
                  <option value="4">04</option>
                  <option value="5">05</option>
                </select>
              </div>
            </div>

            {/* Second Item */}
            <div className="flex flex-row items-center border-b border-gray-200 pb-6">
              <div className="flex-shrink-0 w-20 h-28 md:w-24 md:h-32 flex justify-center">
                <img
                  src={mineral}
                  alt="Mineral Water Bottle"
                  className="w-full h-full object-center object-cover"
                />
              </div>

              <div className="flex-1 px-4">
                <p className="text-base font-black leading-none text-gray-800">
                  Mineral Water Can
                </p>
                <p className="text-sm font-black text-gray-800">Price : ₹40</p>
              </div>

              <div className="flex-shrink-0">
                <select
                  value={quantities.mineral}
                  onChange={(e) =>
                    handleQuantityChange("mineral", e.target.value)
                  }
                  className="py-2 px-1 border border-gray-200"
                >
                  <option value="0">00</option>
                  <option value="1">01</option>
                  <option value="2">02</option>
                  <option value="3">03</option>
                  <option value="4">04</option>
                  <option value="5">05</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <p className="text-lg font-semibold text-gray-800">Total:</p>
            <p className="text-lg font-semibold text-gray-800">
              ₹{totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="flex justify-between mt-8">
            <Link
              to="/"
              className="flex font-semibold text-white bg-green-600 text-sm items-center py-2 px-4 rounded"
            >
              Home
            </Link>

            {totalAmount > 0 && (
              <button
                onClick={handleCheckout}
                className="flex font-semibold text-white bg-green-600 text-sm items-center py-2 px-4 rounded"
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;

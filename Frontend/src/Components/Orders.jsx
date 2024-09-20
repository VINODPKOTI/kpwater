import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login state
  const [showAddressColumn, setShowAddressColumn] = useState(false); // Track if address column should be shown
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is admin (userID === 1)

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    // Check if the userID is 1 to conditionally show the address column and completed button
    if (userID === 'd95f52c1-84b3-4acb-92f2-5977a4e2cc06') {
      setShowAddressColumn(true);
      setIsAdmin(true); // Mark the user as admin
    }

    axios
      .get(`http://localhost:8081/orders/${userID}`)
      .then((response) => {
        const ordersData = response.data;
        setOrders(ordersData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching orders:",
          error.response ? error.response.data : error.message
        );
        setIsLoading(false);
      });
  }, [navigate]);

  const handleCompleteOrder = (orderID) => {
    axios
      .put(`http://localhost:8081/orders/complete/${orderID}`, {
        transaction_status: "Completed",
      })
      .then((response) => {
        console.log(`Order ${orderID} marked as completed.`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderID
              ? { ...order, transaction_status: "Completed" }
              : order
          )
        );
      })
      .catch((error) => {
        console.error(
          `Error completing order ${orderID}:`,
          error.response ? error.response.data : error.message
        );
      });
  };

  const handleConfirmCompleteOrder = (order) => {
    const confirmComplete = window.confirm(
      `Are you sure you want to mark this order as completed?\n\nOrder ID: ${order.id}\nItem Ordered: ${order.item_ordered}\nAddress: ${order.address}`
    );
    if (confirmComplete) {
      handleCompleteOrder(order.id); // Call the function to complete the order
    }
  };

  return (
    <div className="flex justify-center items-center shadow-md m-4 p-4">
      <div className="w-full max-w-3xl shadow-md rounded-lg px-4 py-6 bg-gradient-to-r from-blue-600 to-emerald-600">
        <h1 className="font-semibold text-xl md:text-2xl text-center mb-4">
          Order Details
        </h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : !isLoggedIn ? (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Please log in to see your orders.
            </p>
            <div className="flex justify-center mt-8">
              <Link
                to="/signin"
                className="font-semibold text-white bg-blue-600 hover:bg-blue-700 text-sm py-2 px-4 rounded"
              >
                Log In
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-800">
              You have not ordered anything yet. Please place an order to view
              it here.
            </p>
            <div className="flex justify-center mt-8">
              <Link
                to="/"
                className="font-semibold text-white bg-blue-600 hover:bg-blue-700 text-sm py-2 px-4 rounded"
              >
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-300 pt-4 ">
            <div className="flex justify-between font-semibold text-sm md:text-base text-dark-700 flex-wrap text-center ">
              <div className="w-1/2 sm:w-1/4">Order ID</div>
              <div className="w-1/2 sm:w-1/4">Item Ordered</div>
              {showAddressColumn && (
                <div className="w-1/2 sm:w-1/4">Address</div>
              )}
              <div className="w-1/2 sm:w-1/4">Status</div>
            </div>
            <div className="mt-4">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 flex-wrap hover:bg-gray-100 transition-all duration-200 rounded-lg shadow-sm text-center text-dark-700"
                >
                  <div className="w-1/2 sm:w-1/4 text-xs md:text-base font-medium text-gray-800 dark:text-gray-900 shadow-text">
                    {order.id}
                  </div>
                  <div className="w-1/2 sm:w-1/4 text-xs md:text-base font-semibold text-gray-700">
                    {order.item_ordered}
                  </div>
                  {showAddressColumn && (
                    <div className="w-1/2 sm:w-1/4 text-xs md:text-base text-gray-700 font-bold">
                      {order.address}
                    </div>
                  )}
                  <div className="w-1/2 sm:w-1/4 text-xs md:text-base font-bold text-gray-700">
                    {order.transaction_status}
                  </div>
                  {isAdmin && order.transaction_status !== "Completed" && (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded mt-2 sm:mt-0 shadow-lg transition-transform duration-300 transform hover:scale-105"
                      onClick={() => handleConfirmCompleteOrder(order)}
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;

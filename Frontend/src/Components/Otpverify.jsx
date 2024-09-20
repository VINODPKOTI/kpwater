import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Otpverify = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { formData } = location.state || {};

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);



  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      email: formData.email,
      enteredOtp: otp,
    };

    // Log requestData before sending the request
    console.log("Request Data:", requestData);

    try {
      const response = await fetch("http://localhost:8081/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("OTP verified successfully!");

        // Proceed with user registration after OTP verification
        const registrationResponse = await fetch("http://localhost:8081/register-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const registrationData = await registrationResponse.json();
        if (registrationResponse.ok) {
          console.log("User registered successfully!");
          navigate("/signin");
        } else {
          console.log("Error registering user:", registrationData.message);
        }
      } else {
        console.log("OTP verification failed:", data.message);
        setOtpError(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Server error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col m-5">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>

          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
              {otpSuccess && <p className="text-green-500 text-xs mt-1">OTP verified successfully!</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Otpverify;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Email = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [verificationResponse, setVerificationResponse] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const inputRefs = useRef([]);
  const [update, setupdate] = useState(false);

  useEffect(() => {
    // Set focus on the first input element when OTP input is shown
    if (showOtpInput && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showOtpInput]);

  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    const password = document.getElementById('pass').value;

    // Make a fetch API call to update the password
    fetch('http://localhost:5000/updatePassword', {
      method: 'POST',
      body: JSON.stringify({ email,password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("dataupadte", data);
        // Handle the response from the API
        if (data.status == 200) {
          toast.success('Password Updated successfully.', {
            position: toast.POSITION.TOP_RIGHT,
            onClose: () => navigate('/login'), // Navigate to the desired page after the Toast notification is closed
          });
        }
        
        // ... handle success or error cases ...
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value.length === 1 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const generateOtp = () => {
    // Make a fetch API call to your server to generate the OTP
    fetch('http://localhost:5000/sendotp', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the API
        console.log(data); // Assuming the JWT token is returned as 'data.token'
        setShowOtpInput(true);
        setOtp(['', '', '', '']);
        // Store the JWT token in localStorage
        if (data.token) {
          setVerificationResponse("OTP sent to your mail");
          localStorage.setItem('otpToken', data.token);
        } else {
          console.error('Error: Invalid token');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const verifyOtp = () => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('otpToken');
    console.log("token", token);
    if (!token) {
      console.error('Error: Token not found');
      return;
    }
    // Make a fetch API call to your server to verify the OTP
    fetch('http://localhost:5000/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp: otp.join(''), token }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the API
        console.log(data);
        setVerificationResponse(data.response);
        if (data.status === 200) {
          localStorage.removeItem('otpToken');
          setOtp(['', '', '', '']); // Clear the OTP values
          toast.success('OTP verified. You can now update the password.', {
            position: toast.POSITION.TOP_RIGHT,
            onClose: () => setupdate(true), // Navigate to the desired page after the Toast notification is closed
          });
        } else {
          setOtp(['', '', '', '']); // Clear the OTP values
          inputRefs.current[0].focus();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      {update? (
        <div className='login-container'>
          <form id="update" className="update-form" onSubmit={handleUpdateSubmit}>
  
              <label htmlFor="name">New Password:</label>
              <input type="text" autoComplete="off" id="pass" placeholder="Enter New password" />
        <input type="submit" value="Update Password" />
        
      </form>
        </div>
      ) : (
        <div className="container">
          <div className="card">
            <label className="input-label">
              Email:
              <input type="text" value={email} onChange={handleEmailChange} className="input-field" placeholder="Enter Your Email" />
            </label>
            <button onClick={generateOtp} className="btn-generate">Generate OTP</button>
            {showOtpInput && (
              <div>
                <p className="otp-label">Enter OTP:</p>
                <div className="otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      maxLength={1}
                      className="otp-input"
                      ref={(ref) => (inputRefs.current[index] = ref)}
                    />
                  ))}
                </div>
                <button onClick={verifyOtp} className="btn-verify">Verify OTP</button>
              </div>
            )}
            {verificationResponse && <p className="verification-response">{verificationResponse}</p>}
          </div>
        </div>
      )}
  
      <ToastContainer position="top-right" />

    </>
  );
  
};

export default Email;

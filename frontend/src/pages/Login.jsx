import React, { useState } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const Login = () => {
    const [phone, setPhone] = useState('+880');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // phone or otp

    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
    };

    const sendOtp = () => {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phone, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setStep('otp');
            }).catch(err => alert(err.message));
    };

    const verifyOtp = () => {
        window.confirmationResult.confirm(otp).then((result) => {
            window.location.href = "/";
        }).catch(err => alert("Wrong OTP"));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to SIM Service</h2>
                
                {step === 'phone' ? (
                    <>
                        <input className="w-full p-3 border rounded-lg mb-4" 
                               value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <div id="recaptcha-container"></div>
                        <button onClick={sendOtp} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">Send OTP</button>
                    </>
                ) : (
                    <>
                        <input className="w-full p-3 border rounded-lg mb-4" placeholder="Enter OTP"
                               value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <button onClick={verifyOtp} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold">Verify OTP</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;

'use client';

import LandingIntro from '@/features/login/landing-intro';
import ErrorText from '@/components/typography/error-text';
import ThemedInput from '@/components/input/ThemedInput';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, useAuth } from '@/lib/AuthProvider';
import axios from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { loginUser } from '@/features/common/userSlice';

interface LoginObj {
  otp: string;
  emailId: string;
  username: string;
  password: string;
}

function SignUp(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useAuth();

  const [loginObj, setLoginObj] = useState<LoginObj>({
    otp: '',
    emailId: '',
    username: '',
    password: '',
  });

  const submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setErrorMessage('');
    if (loading) return;
    if (isOtpSent) {
      submitVerificationCode();
    } else {
      sendMailOtp();
    }
  };

  const sendMailOtp = async () => {
    if (loginObj.username.trim() === '') {
      setErrorMessage('Username is required!');
      return;
    } else if (loginObj.emailId.trim() === '') {
      setErrorMessage('Email Id is required!');
      return;
    } else if (loginObj.password.trim() === '') {
      setErrorMessage('Password is required!');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/send-otp`,
        loginObj,
        { withCredentials: true }
      );
      setIsOtpSent(true);
      setLoading(false);
    } catch (error: any) {
      setIsOtpSent(false);
      setLoading(false);
      setErrorMessage(error.response?.data?.message || 'Error sending OTP');
    }
  };

  const submitVerificationCode = async () => {
    if (loginObj.otp.trim() === '') {
      setErrorMessage('OTP is required!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/signup`,
        loginObj,
        { withCredentials: true }
      );
      const { message, ...rest } = response.data;
      dispatch(loginUser(rest));
      userLogin(rest);
      setLoading(false);
      setLoginObj({ otp: '', emailId: '', username: '', password: '' });
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  const userLogin = async (user: User) => {
    await login(user);
  };

  const updateFormValue = (updateType: string, value: string): void => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  const handleGoBack = () => {
    setIsOtpSent(false);
    setLoginObj({ ...loginObj, otp: '' });
  };

  return (
    <div className="min-h-screen bg-[#F0F5F9] flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-white rounded-xl overflow-hidden">
          <div className="bg-[#BBE1FA]">
            <LandingIntro />
          </div>
          <div className="py-16 px-10">
            <form onSubmit={submitForm}>
              <div className="mb-4">
                {!isOtpSent && (
                  <>
                    <div className="mb-10">
                      <p className="text-center text-2xl font-bold text-[#1B262C]">
                        Create your Account
                      </p>
                      <p className="text-center text-sm text-[#3282B8]">
                        Already have an account?
                        <a className="underline pl-1" href="/login">
                          Sign in
                        </a>
                      </p>
                    </div>

                    <ThemedInput
                      label="Username"
                      value={loginObj.username}
                      onChange={(val) => updateFormValue('username', val)}
                      placeholder="Enter your username"
                    />

                    <ThemedInput
                      type="email"
                      label="Email Id"
                      value={loginObj.emailId}
                      onChange={(val) => updateFormValue('emailId', val)}
                      placeholder="you@example.com"
                    />

                    <ThemedInput
                      type="password"
                      label="Password"
                      value={loginObj.password}
                      onChange={(val) => updateFormValue('password', val)}
                      placeholder="Enter your password"
                    />
                  </>
                )}

                {isOtpSent && (
                  <>
                    <p className="text-center text-lg font-semibold text-[#1B262C]">
                      Enter OTP sent to {loginObj.emailId}
                    </p>
                    <p className="text-center text-[#3282B8] mt-2 text-sm">
                      Didn&apos;t receive it? Check your spam folder.
                    </p>

                    <ThemedInput
                      label="Verification Code"
                      value={loginObj.otp}
                      onChange={(val) => updateFormValue('otp', val)}
                      placeholder="Ex- 123456"
                    />

                    <p
                      className="text-center text-sm text-red-500 mt-4 cursor-pointer hover:underline"
                      onClick={handleGoBack}
                    >
                      Not your email? Go back
                    </p>
                  </>
                )}
              </div>

              {errorMessage && (
                <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
              )}

              <button
                type="submit"
                className="btn mt-6 w-full bg-[#3282B8] hover:bg-[#1B262C] text-white border-none py-3 rounded-lg flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                {isOtpSent ? 'Verify' : 'Get Email Verification Code'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

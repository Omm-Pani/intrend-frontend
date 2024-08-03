'use client';

import LandingIntro from '@/features/login/landing-intro';
import InputText from '@/components/input/input-text';
import ErrorText from '@/components/typography/error-text';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import axios from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { loginUser } from '@/features/common/userSlice';

interface LoginObj {
  otp: string;
  emailId: string;
  username: string;
  password: string;
}

function Login(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showLoginPage, setShowLoginPage] = useState<boolean>(true);
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
    if (loginObj.emailId.trim() === '') {
      setErrorMessage('Username is required!');
      return;
    } else if (loginObj.password.trim() === '') {
      setErrorMessage('Email Id is required!');
      return;
    } else if (loginObj.username.trim() === '') {
      setErrorMessage('Password is required!');
      return;
    } else {
      setLoading(true);
      try {
        const otpResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/user/send-otp`,
          loginObj,
          {
            withCredentials: true,
          }
        );
        setIsOtpSent(true);
        setLoading(false);
      } catch (error: any) {
        setIsOtpSent(false);
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const submitVerificationCode = async () => {
    if (loginObj.otp.trim() === '') {
      setErrorMessage('OTP is required!');
      return;
    } else {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/user/signup`,
          loginObj,
          {
            withCredentials: true,
          }
        );
        const { message, ...rest } = response.data;
        console.log(rest);
        console.log('userData', rest);
        dispatch(loginUser(rest));
        userLogin(rest.token);
        setLoading(false);
        setLoginObj({ otp: '', emailId: '', username: '', password: '' });
      } catch (error: any) {
        setIsOtpSent(false);
        setLoading(false);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const userLogin = async ({ token }: { token: string }) => {
    await login(token);
  };

  const updateFormValue = (updateType: string, value: string): void => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div>
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                {!isOtpSent && (
                  <>
                    <div className="md:mt-0 mt-6 mb-12">
                      <p className="text-center text-2xl font-bold">
                        Create your Account
                      </p>
                      <p className="text-center text-sm font-normal">
                        Already have an account?
                        <a className="underline pl-1" href="/login">
                          Sign in
                        </a>
                      </p>
                    </div>

                    <InputText
                      defaultValue={loginObj.username}
                      updateType="username"
                      containerStyle="mt-2"
                      labelTitle="Username"
                      placeholder="Username"
                      updateFormValue={updateFormValue}
                    />

                    <InputText
                      type="email"
                      defaultValue={loginObj.emailId}
                      updateType="emailId"
                      containerStyle="mt-2"
                      labelTitle="Email Id"
                      placeholder="email@email.com"
                      updateFormValue={updateFormValue}
                    />
                    <InputText
                      type="password"
                      defaultValue={loginObj.password}
                      updateType="password"
                      containerStyle="mt-2"
                      labelTitle="Password"
                      placeholder="Password"
                      updateFormValue={updateFormValue}
                    />
                  </>
                )}

                {isOtpSent && (
                  <>
                    <p className="text-center text-lg   md:mt-0 mt-6   font-semibold">
                      Enter otp received on {loginObj.emailId}
                    </p>
                    <p className="text-center text-slate-500 mt-2 text-sm">
                      Didn&apos;t receive mail? Check spam folder
                    </p>

                    <InputText
                      defaultValue={loginObj.otp}
                      updateType="otp"
                      containerStyle="mt-4"
                      labelTitle="Verification Code"
                      placeholder="Ex- 123456"
                      updateFormValue={updateFormValue}
                    />
                  </>
                )}
              </div>

              <div className="mt-8">
                {errorMessage && (
                  <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                )}
                <button type="submit" className={`btn mt-2 w-full btn-primary`}>
                  {loading && <span className="loading loading-spinner"></span>}
                  {isOtpSent ? 'Verify' : 'Get Email Verification Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

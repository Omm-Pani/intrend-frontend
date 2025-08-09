'use client';

import LandingIntro from '@/features/login/landing-intro';
import ThemedInput from '@/components/input/ThemedInput';
import ErrorText from '@/components/typography/error-text';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import axios from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { loginUser } from '@/features/common/userSlice';

interface LoginObj {
  emailId: string;
  password: string;
}

function Login(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const [loginObj, setLoginObj] = useState<LoginObj>({
    emailId: '',
    password: '',
  });

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginObj.emailId.trim())
      return setErrorMessage('Email Id is required!');
    if (!loginObj.password.trim())
      return setErrorMessage('Password is required!');

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/signin`,
        loginObj,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { message, ...rest } = response.data;
        dispatch(loginUser(rest));
        await login(rest);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = (field: keyof LoginObj, value: string) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [field]: value });
  };

  return (
    <div className="min-h-screen bg-[#F0F5F9] flex items-center relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#1B262C]/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <span className="loading loading-spinner loading-lg text-[#BBE1FA]"></span>
            <p className="text-white mt-4 font-semibold">Signing you in...</p>
          </div>
        </div>
      )}

      <div className="card mx-auto w-full max-w-5xl shadow-xl rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 bg-white">
          <LandingIntro />
          <div className="p-10 md:p-16">
            <form onSubmit={submitForm}>
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Login to your Account
                </h2>
                <p className="text-gray-600 mt-2">
                  Don&apos;t have an account?
                  <a
                    href="/signup"
                    className="text-primary font-semibold hover:underline ml-1"
                  >
                    Sign up
                  </a>
                </p>
              </div>

              <ThemedInput
                label="Email Id"
                type="email"
                placeholder="you@example.com"
                value={loginObj.emailId}
                onChange={(val) => updateFormValue('emailId', val)}
              />
              <ThemedInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={loginObj.password}
                onChange={(val) => updateFormValue('password', val)}
              />

              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

              <button
                type="submit"
                className="btn btn-primary w-full mt-6 rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

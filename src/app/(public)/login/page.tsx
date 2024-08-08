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
  emailId: string;
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
    emailId: '',
    password: '',
  });

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    if (loginObj.emailId.trim() === '') {
      setErrorMessage('Email Id is required!');
      return;
    } else if (loginObj.password.trim() === '') {
      setErrorMessage('Password is required!');
      return;
    } else {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/signin`,
        loginObj,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const { message, ...rest } = response.data;
        console.log('userData', rest);
        dispatch(loginUser(rest));
        userLogin({ token: rest.token });
        setLoading(false);
        setErrorMessage('');
      } else {
        setLoading(false);
        setErrorMessage(response.data.message);
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
                <>
                  <div className="md:mt-0 mt-6 mb-12">
                    <p className="text-center text-2xl font-bold">
                      Login to your Account
                    </p>
                    <p className="text-center text-sm font-normal">
                      Don&apos;t have an account?
                      <a className="underline pl-1" href="/signup">
                        Sign up
                      </a>
                    </p>
                  </div>

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
              </div>

              <div className="mt-8">
                {errorMessage && (
                  <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                )}
                <button type="submit" className={`btn mt-2 w-full btn-primary`}>
                  {loading && <span className="loading loading-spinner"></span>}
                  {'Sign in'}
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

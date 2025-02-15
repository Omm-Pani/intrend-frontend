// lib/auth.ts
'use client';

import Cookies from 'js-cookie';

const auth = {
  saveToken: (token: string) => {
    Cookies.set('auth-token', token, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  },

  saveUserData: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    Cookies.set('auth-token', user.token, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  },

  getUserData: () => {
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser || '{}');
    const token = Cookies.get('auth-token');
    return { user, token };
  },

  getToken: (): string | undefined => {
    return Cookies.get('auth-token');
  },

  logout: async () => {
    Cookies.remove('auth-token');
    return 1;
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get('auth-token');
  },
};

export default auth;

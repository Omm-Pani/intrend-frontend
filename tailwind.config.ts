import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],

  // daisyUI config (optional - here you can change the theme)
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#52616B',
          secondary: '#1E2022',
          accent: '#37CDBE',
          neutral: '#3D4451',
          'base-100': '#F0F5F9',
          'base-200': '#C9D6DF',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#793EF9',
          secondary: '#fff',
          accent: '#37CDBE',
          neutral: '#191D24',
          'base-100': '#0d1117',
          'base-200': '#191e24',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
  },
};
export default config;

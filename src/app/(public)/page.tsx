'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  onMenuToggle: () => void;
}

// const ProductShowcase: React.FC = () => (
//   <div className="py-16 sm:py-20">
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
//         A better way to manage your channel
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
//         {/* Feature 1 */}
//         <div className="p-4 flex flex-col items-center">
//           <img
//             src="/product-ss.png"
//             alt="Secure Access Management"
//             className="rounded-lg shadow-xl mb-6 w-full max-w-xs h-auto object-cover"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               target.onerror = null;
//               target.src =
//                 'https://placehold.co/400x300/E2E8F0/4A5568?text=Secure+Access';
//             }}
//           />
//           <h3 className="text-xl font-semibold text-gray-800">
//             Secure Access Management
//           </h3>
//           <p className="mt-2 text-gray-600">
//             Grant publishing rights to team members without ever sharing your
//             primary login credentials.
//           </p>
//         </div>
//         {/* Feature 2 */}
//         <div className="p-4 flex flex-col items-center">
//           <img
//             src="/product-ss2.png"
//             alt="Content Publishing Workflow"
//             className="rounded-lg shadow-xl mb-6 w-full max-w-xs h-auto object-cover"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               target.onerror = null;
//               target.src =
//                 'https://placehold.co/400x300/E2E8F0/4A5568?text=Streamlined+Workflow';
//             }}
//           />
//           <h3 className="text-xl font-semibold text-gray-800">
//             Streamlined Workflow
//           </h3>
//           <p className="mt-2 text-gray-600">
//             Editors can upload and schedule content, which you can then approve
//             with a single click.
//           </p>
//         </div>
//         {/* Feature 3 */}
//         <div className="p-4 flex flex-col items-center">
//           <img
//             src="/feature3.png"
//             alt="Private Login Protection"
//             className="rounded-lg shadow-xl mb-6 w-full max-w-xs h-auto object-cover"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               target.onerror = null;
//               target.src =
//                 'https://placehold.co/400x300/E2E8F0/4A5568?text=Private+Account';
//             }}
//           />
//           <h3 className="text-xl font-semibold text-gray-800">
//             Keep Your Account Private
//           </h3>
//           <p className="mt-2 text-gray-600">
//             Your YouTube account remains secure and private, accessible only by
//             you, always.
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => (
  <header className="flex justify-between items-center py-6">
    <div className="flex items-center mt-1">
      <Image
        src={'/captainLogoLight.png'}
        alt="Logo"
        width={200}
        height={150}
      />
    </div>

    <div className="flex items-center ">
      <a
        href="/signup"
        className="hidden sm:inline-block shadow-lg bg-white border border-gray-600 text-gray-800 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
      >
        Get started
      </a>
    </div>
  </header>
);

// Mobile Menu Component
const MobileMenu: React.FC = () => (
  <div className="md:hidden bg-white rounded-lg shadow-lg p-4 mt-2">
    <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">
      Home
    </a>
    <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">
      Features
    </a>
    <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">
      Integration
    </a>
    <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">
      Pricing
    </a>
    <a
      href="#"
      className="block bg-gray-800 text-white text-center mt-2 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900"
    >
      Get started
    </a>
  </div>
);

// Hero Section Component
const Hero: React.FC = () => {
  // Styles for the gradient text effect
  const heroHighlightStyle: React.CSSProperties = {
    background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <main className="text-center lg:pb-10 lg:pt-20">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
        Collaborate without
        <br />
        Compromising<span style={heroHighlightStyle}> Security</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
        Share content publishing access with editors and managers, while keeping
        your
        <br />
        Youtube login private.
      </p>
      <div className="mt-8 flex justify-center items-center space-x-4">
        <a
          href="/signup"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900"
        >
          Get Started
        </a>
      </div>
    </main>
  );
};

function Page() {
  const router = useRouter();
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    router.replace(`/`);
  }, []);

  return (
    <div
      className="bg-gray-50 h-full"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header onMenuToggle={toggleMenu} />
        {isMenuOpen && <MobileMenu />}
        <Hero />
        {/* Image Section */}
        {/* <ProductShowcase /> */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          A better way to manage your channel
        </h2>
        <div className="mt-2 mb-16">
          <img
            src="/product-ss.png"
            alt="product screenshot"
            className="rounded-xl shadow-2xl mx-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                'https://placehold.co/1200x600/E2E8F0/4A5568?text=Image+Not+Found';
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;

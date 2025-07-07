'use client';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import Link from 'next/link';
import SidebarSubmenu from './sidebar-submenu';
import routes from '@/helper/sidebar-routes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setPageTitle } from '@/features/common/headerSlice';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/outline/ArrowUpOnSquareIcon';
import auth from '@/lib/auth';
import Image from 'next/image';
import { themeChange } from 'theme-change';

interface LeftSidebarProps {}

function LeftSidebar(props: LeftSidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [currentTheme, setCurrentTheme] = useState<string | null>(
    localStorage.getItem('theme')
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setCurrentTheme(newTheme);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Initialize with current data-theme
    setCurrentTheme(document.documentElement.getAttribute('data-theme'));

    return () => {
      observer.disconnect();
    };
  }, []);

  const close = () => {
    const leftSidebarDrawer = document.getElementById('left-sidebar-drawer');
    if (leftSidebarDrawer) leftSidebarDrawer.click();
  };
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    let routeObj = routes.filter((r) => {
      return r.path == pathname;
    })[0];
    if (routeObj) {
      dispatch(setPageTitle({ title: routeObj.pageTitle }));
    } else {
      const secondSlashIndex = pathname.indexOf('/', pathname.indexOf('/') + 1);
      if (secondSlashIndex !== -1) {
        const substringBeforeSecondSlash = pathname.substring(
          0,
          secondSlashIndex
        );
        let submenuRouteObj = routes.filter((r) => {
          return r.path == substringBeforeSecondSlash;
        })[0];
        if (submenuRouteObj.submenu) {
          let submenuObj = submenuRouteObj.submenu.filter((r) => {
            return r.path == pathname;
          })[0];
          console.log('herere', submenuObj);
          dispatch(setPageTitle({ title: submenuObj.pageTitle }));
        }
      }
    }
  }, [pathname]);

  const logoutUser = async () => {
    console.log('here');
    await auth.logout();
    window.location.href = '/';
  };

  return (
    <div className="drawer-side z-30 ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <div className="m-2">
        <Link className="flex justify-start" href="#">
          <Image
            className="w-full"
            src={
              currentTheme === 'light'
                ? '/captainLogoLight.png'
                : '/captainLogoDark.png'
            }
            width={195}
            height={100}
            alt="logo"
          />
        </Link>
      </div>
      <ul className="menu pt-2 w-64 bg-base-100 text-base-content">
        <button
          className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={close}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <div
          className="overflow-y-auto no-scrollbar"
          style={{ height: '100%' }}
        >
          {routes.map((route, k: number) => (
            <li className="" key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <Link
                  href={route.path}
                  className={`${
                    pathname == route.path
                      ? 'font-semibold bg-base-200 '
                      : 'font-normal'
                  }`}
                >
                  {route.icon} {route.pageName}
                  {pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </Link>
              )}
            </li>
          ))}
        </div>
      </ul>
      {/* Profile icon, opening menu on click */}
      <div className="dropdown bottom-0 absolute dropdown-top w-64 ">
        <div
          tabIndex={0}
          role="button"
          className="btn w-full bg-base-100 text-left justify-start rounded-b-none"
        >
          <div className="avatar">
            <div className="w-6 rounded-full border-2 border-primary"></div>
          </div>
          {user.username}
          <ChevronUpIcon className="w-4 " />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content visible w-52 px-4 z-[1]  menu  shadow bg-base-200 rounded-box "
        >
          <div className=" m-0"></div>
          <li onClick={() => logoutUser()}>
            <a className=" ">
              <ArrowUpOnSquareIcon className="w-4 " />
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;

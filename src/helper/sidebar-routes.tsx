import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import WalletIcon from '@heroicons/react/24/outline/WalletIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
import { SidebarMenuObj } from './types';
import { BoltIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

// Import other icons similarly

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes: SidebarMenuObj[] = [
  {
    path: '/dashboard',
    icon: <Squares2X2Icon className={iconClasses} />,
    pageName: 'Dashboard',
    pageTitle: 'Dashboard',
  },
  {
    path: '/posts-center',
    icon: <CloudArrowUpIcon className={iconClasses} />,
    pageName: 'Post Center',
    pageTitle: 'Post Center',
  },
  {
    path: '/integrations',
    icon: <BoltIcon className={iconClasses} />,
    pageName: 'integrations',
    pageTitle: 'integrations',
  },
  {
    path: '/team',
    icon: <UsersIcon className={submenuIconClasses} />,
    pageName: 'Team',
    pageTitle: 'Team',
  },
];

export default routes;

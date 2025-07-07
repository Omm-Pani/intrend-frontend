import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import { SidebarMenuObj } from './types';
import { BoltIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const iconClasses = `h-6 w-6`;

const routes: SidebarMenuObj[] = [
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
];

export default routes;

import React from 'react';
import DashboardStats from './DashboardStats';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import { showNotification } from '../common/headerSlice';

interface StatData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const statsData: StatData[] = [
  {
    title: 'Youtube',
    value: '100k',
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: '↗︎ 2300 (22%)',
  },
  {
    title: 'Facebook',
    value: '100k',
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: '↗︎ 2300 (22%)',
  },
];

const Dashboard: React.FC = () => {
  // const dispatch = useDispatch();

  // const updateDashboardPeriod = (newRange: any) => {
  //     // Dashboard range changed, write code to refresh your values
  //     dispatch(showNotification({ message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1 }));
  // }

  return (
    <>
      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => (
          <DashboardStats key={k} {...d} colorIndex={k} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;

'use client';
import React, { useEffect, useState } from 'react';
import DashboardStats from './DashboardStats';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import axios from 'axios';
// import { showNotification } from '../common/headerSlice';

interface StatData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const Dashboard: React.FC = () => {
  const [ytSubs, setYtSubs] = useState('');
  // useEffect(() => {
  //   axios
  //     .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/youtube/list-channels`, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       setYtSubs(response.data[0].subscriber_count);
  //     });
  // }, []);
  const statsData: StatData[] = [
    {
      title: 'Youtube',
      value: ytSubs,
      icon: <UserGroupIcon className="w-8 h-8" />,
      description: '↗︎ subscribers',
    },
    {
      title: 'Facebook',
      value: '100k',
      icon: <UserGroupIcon className="w-8 h-8" />,
      description: '↗︎ 2300 (22%)',
    },
  ];
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

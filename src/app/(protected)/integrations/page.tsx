'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from '../../../components/cards/title-card';
// import { showNotification } from '../common/headerSlice';

const INITIAL_INTEGRATION_LIST = [
  {
    name: 'Facebook',
    icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    isActive: false,
    description:
      'Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., and TheFacebook.',
  },
  // {
  //   name: 'Gmail',
  //   icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968534.png',
  //   isActive: false,
  //   description:
  //     'Gmail is a free email service provided by Google. As of 2019, it had 1.5 billion active users.',
  // },
  {
    name: 'Youtube',
    icon: 'https://cdn-icons-png.flaticon.com/512/174/174883.png',
    isActive: false,
    description:
      'YouTube is an American online video sharing platform owned by Google. Founded in 2005',
  },
];

function Page() {
  const dispatch = useDispatch();

  const [integrationList, setIntegrationList] = useState(
    INITIAL_INTEGRATION_LIST
  );

  //   const updateIntegrationStatus = (index: number) => {
  //     let integration = integrationList[index];
  //     setIntegrationList(
  //       integrationList.map((i, k) => {
  //         if (k === index) {
  //           return { ...i, isActive: !i.isActive };
  //         }

  //         return i;
  //       })
  //     );
  //   dispatch(
  //     showNotification({
  //       message: `${integration.name} ${
  //         integration.isActive ? 'disabled' : 'enabled'
  //       }`,
  //       status: 1,
  //     })
  //   );
  //   };

  const handleIntegration = (integration: string) => () => {
    switch (integration) {
      case 'Facebook':
        window.location.href = 'http://localhost:5000/auth/facebook';

        break;
      case 'Gmail':
        console.log('Gmail');

        break;
      case 'Youtube':
        window.location.href = 'http://localhost:5000/youtube/auth';

        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrationList.map((i, k) => {
          return (
            <button key={k} onClick={handleIntegration(i.name)}>
              <TitleCard title={i.name} topMargin={'mt-2'}>
                <p className="flex">
                  <img
                    alt="icon"
                    src={i.icon}
                    className="w-12 h-12 inline-block mr-4"
                  />
                  {i.description}
                </p>
              </TitleCard>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default Page;

'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from '../../../components/cards/title-card';
import Cookies from 'js-cookie';
import axios from 'axios';
import Subtitle from '@/components/typography/subtitle';

// import { showNotification } from '../common/headerSlice';

export interface ytChannel {
  channel_id: string;
  channel_title: string;
  channel_description: string;
  channel_thumbnail: string;
  subscriber_count: number;
  tokens: any;
  userId: string;
}
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

const INITIAL_INTEGRATION_LIST = [
  {
    name: 'Youtube',
    icon: 'https://cdn-icons-png.flaticon.com/512/174/174883.png',
  },
  {
    name: 'Facebook',
    icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
  },
  // {
  //   name: 'Gmail',
  //   icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968534.png',
  //   isActive: false,
  //   description:
  //     'Gmail is a free email service provided by Google. As of 2019, it had 1.5 billion active users.',
  // },
];

function Page() {
  const dispatch = useDispatch();
  const [channelList, setChannelList] = useState<ytChannel[]>([]);
  const [connectedChannelId, setConnectedChannelId] = useState('');
  const [isChecked, setIsChecked] = useState(true);

  const [integrationList, setIntegrationList] = useState(
    INITIAL_INTEGRATION_LIST
  );

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get(`${serverUrl}/youtube/list-channels`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('auth-token')}`,
          },
        });
        setChannelList(response.data.map((channel: ytChannel) => channel));
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };

    const checkConnectedYtChannel = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/youtube/check-connected-channel`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('auth-token')}`,
            },
          }
        );

        setConnectedChannelId(response.data.channel_id);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
    fetchChannels();
    checkConnectedYtChannel();
  }, []);

  const handleIntegration = (integration: string) => async () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    switch (integration) {
      case 'Facebook':
        try {
          const response = await axios.get(`${serverUrl}/auth/facebook`, {
            headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` },
          });
          window.location.href = response.data.url;
        } catch (error: any) {
          console.error(`Error connecting to facebook`, error);
        }
        break;

      case 'Gmail':
        console.log('Gmail');
        break;

      case 'Youtube':
        try {
          const response = await axios.get(`${serverUrl}/youtube/auth`, {
            headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` },
          });
          window.location.href = response.data.url;
        } catch (error: any) {
          console.error(`Error connecting to youtube`, error);
        }
        break;

      default:
        break;
    }
  };

  const handleToggle = async (isChecked: boolean, channelId: string) => {
    if (isChecked && channelId !== connectedChannelId) {
      await handleReconnect(channelId);
    }
  };

  const handleReconnect = async (channelId: string) => {
    const response = await axios.post(
      `${serverUrl}/youtube/reconnect-channel`,
      {
        channelId: channelId,
      },
      {
        headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` },
      }
    );
    if (response.status === 200) {
      setConnectedChannelId(channelId);
    }
  };
  const handleDisconnect = async (channelId: string) => {
    const response = await axios.post(
      `${serverUrl}/youtube/disconnect-channel`,
      { channelId: channelId },
      {
        headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` },
      }
    );
    if (response.status === 200) {
      setChannelList(
        channelList.filter(
          (channel: ytChannel) => channel.channel_id !== channelId
        )
      );
    }
  };

  return (
    <>
      <div className="mt-6 ml-auto mr-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrationList.map((i, k) => {
            return (
              <button
                key={k}
                onClick={handleIntegration(i.name)}
                className="btn relative bg-base-100 btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
              >
                <img
                  alt="icon"
                  src={i.icon}
                  className="absolute left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                />
                <span className="text-center text-md text-secondary">
                  Connect to {i.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 ml-auto mr-auto max-w-6xl items-center card w-full p-6 bg-base-100 shadow-xl">
        <Subtitle>Accounts Connected</Subtitle>
        <div className="divider mt-2"></div>
        <ul className="w-2/3">
          {channelList.length > 0 ? (
            channelList.map((channel: ytChannel, index) => (
              <li key={index}>
                <div className="form-control bg-primary rounded-2xl p-2 mb-2">
                  <label className="flex cursor-pointer justify-between items-center pl-4 pr-4">
                    <div className="flex items-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/174/174883.png"
                        alt=""
                        className="w-12 h-12 inline-block mr-2"
                      />
                      <span className="text-lg font-semibold text-white">
                        {channel.channel_title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-error"
                        checked={channel.channel_id === connectedChannelId}
                        onChange={(val) => {
                          handleToggle(val.target.checked, channel.channel_id);
                        }}
                      />
                      <button
                        className="btn btn-sm  btn-warning"
                        onClick={() => handleDisconnect(channel.channel_id)}
                      >
                        Revoke
                      </button>
                    </div>
                  </label>
                </div>
              </li>
            ))
          ) : (
            <div
              role="alert"
              className="flex items-center justify-center alert alert-info font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              No channels connected
            </div>
          )}
        </ul>
      </div>
    </>
  );
}

export default Page;

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

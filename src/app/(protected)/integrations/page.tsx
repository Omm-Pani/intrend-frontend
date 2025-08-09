'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from '../../../components/cards/title-card';
import Cookies from 'js-cookie';
import axios from 'axios';
import Subtitle from '@/components/typography/subtitle';

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
];

function Page() {
  const dispatch = useDispatch();
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const [channelList, setChannelList] = useState<ytChannel[]>([]);
  const [connectedChannelId, setConnectedChannelId] = useState('');
  const [integrationList, setIntegrationList] = useState(
    INITIAL_INTEGRATION_LIST
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [channelsRes, connectedRes] = await Promise.all([
          axios.get(`${serverUrl}/youtube/list-channels`, {
            headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` },
          }),
          axios.get(`${serverUrl}/youtube/check-connected-channel`, {
            headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` },
          }),
        ]);
        setChannelList(channelsRes.data || []);
        setConnectedChannelId(connectedRes.data.channel_id || '');
      } catch (err: any) {
        setError(err.response?.data?.message || 'No channels connected.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshFlag]);

  const handleIntegration = (integration: string) => async () => {
    setLoading(true);
    setError('');
    try {
      if (integration === 'Youtube') {
        const response = await axios.get(`${serverUrl}/youtube/auth`, {
          headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` },
        });
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || `Error connecting to ${integration}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = async (channelId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${serverUrl}/youtube/reconnect-channel`,
        { channelId },
        { headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` } }
      );
      if (response.status === 200) setConnectedChannelId(channelId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reconnect channel.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (channelId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${serverUrl}/youtube/disconnect-channel`,
        { channelId },
        { headers: { Authorization: `Bearer ${Cookies.get('auth-token')}` } }
      );
      if (response.status === 200) {
        setChannelList(channelList.filter((c) => c.channel_id !== channelId));
        setRefreshFlag((prev) => !prev);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disconnect channel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-6 ml-auto mr-auto max-w-7xl">
        {loading && (
          <div className="flex justify-center mb-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        {error && (
          <div role="alert" className="text-red-600 mb-2 flex justify-center">
            <span>{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrationList.map((i, k) => (
            <button
              key={k}
              onClick={handleIntegration(i.name)}
              disabled={loading}
              className="btn relative bg-[#F0F5F9] btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
            >
              <img
                alt="icon"
                src={i.icon}
                className="absolute left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
              <span className="text-center text-md text-[#1E2022]">
                Connect to {i.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 ml-auto mr-auto max-w-6xl items-center card w-full p-6 bg-[#F0F5F9] shadow-xl">
        <Subtitle>Accounts Connected</Subtitle>
        <div className="divider mt-2"></div>
        <ul className="w-2/3">
          {channelList.length > 0 ? (
            channelList.map((channel, index) => (
              <li key={index}>
                <div className="form-control bg-[#52616B] rounded-2xl p-2 mb-2">
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
                          if (
                            val.target.checked &&
                            channel.channel_id !== connectedChannelId
                          ) {
                            handleReconnect(channel.channel_id);
                          }
                        }}
                      />
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleDisconnect(channel.channel_id)}
                        disabled={loading}
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

import { fetcher, fetcherPost } from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import useSWR from 'swr';

export type LeaderboardPayload = {
  id?: string;
  createdAt?: string | undefined;
  name: string;
  wpm: number;
  type: string;
  time: number;
};

type LeaderboardAPIPayload = {
  daily: LeaderboardPayload[];
  allTime: LeaderboardPayload[];
};

export const getLeaderboard = async (): Promise<LeaderboardAPIPayload> => {
  const res = await fetcher(ENDPOINTS.leaderboard.root)
  return res.data;
};

const useLeaderboard = () => {
  const { data, isLoading } = useSWR('getLeaderboard', getLeaderboard, {
    fallbackData: undefined,
  });

  const createLeaderboardData = async (data: LeaderboardPayload) => {
    const res = await fetcherPost([ENDPOINTS.leaderboard.root, JSON.stringify({ ...data })]);
    return res.data;
  };

  return {
    daily: data?.daily,
    allTime: data?.allTime,
    isLoading,
    createLeaderboardData,
  };
};

export default useLeaderboard;

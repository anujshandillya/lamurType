import useSWR from 'swr';
import type { LeaderboardPayload } from './use-leaderboard';
import { fetcher } from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

type UserPayload = {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    createdAt: string;
};

type ProfileStatsPayload = {
  best: LeaderboardPayload[];
  recent: LeaderboardPayload[];
};

export const getCurrentUser = async (): Promise<UserPayload | null> => {
  const res = await fetcher(ENDPOINTS.auth.me);
  return res.data;
};

const getProfileStats = async (): Promise<ProfileStatsPayload> => {
  const res = await fetcher(ENDPOINTS.leaderboard.profile);
  return res.data;
};

const useProfile = () => {
  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR('getCurrentUser', getCurrentUser);

  const { data: profileStats } = useSWR('getProfileStats', getProfileStats);

  const clearUser = () => mutate(null, false);

  return { user, clearUser, isLoading, profileStats };
};

export default useProfile;

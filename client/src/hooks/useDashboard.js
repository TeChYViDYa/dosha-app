/**
 * useDashboard
 * Fetches user profile, quiz history, and recommendations
 * for the dashboard screen.
 */

import { useState, useEffect } from 'react';
import { userApi, recommendationApi } from '../api/api';

export default function useDashboard() {
  const [status, setStatus]   = useState('loading'); // loading | ready | no_data | error
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [recs, setRecs]       = useState(null);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch user profile
        const user = await userApi.getProfile();

        // 2. No quiz taken yet
        if (!user.prakriti?.percent || !user.prakriti?.lockedAt) {
          setStatus('no_data');
          return;
        }

        setProfile(user);

        // 3. Fetch history and recommendations in parallel
        const [historyData, recsData] = await Promise.allSettled([
          userApi.getHistory(),
          recommendationApi.fromProfile(),
        ]);

        if (historyData.status === 'fulfilled') {
          setHistory(historyData.value.results ?? []);
        }

        if (recsData.status === 'fulfilled') {
          setRecs(recsData.value.recommendations);
        }

        setStatus('ready');
      } catch (err) {
        // 404 = user not registered yet
        if (err?.response?.status === 404) {
          setStatus('no_data');
        } else {
          setError(err.message);
          setStatus('error');
        }
      }
    }

    load();
  }, []);

  return { status, profile, history, recs, error };
}

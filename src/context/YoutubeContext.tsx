import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

interface YoutubeVideo {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  published_at: string;
  channel_id: string;
}

interface YoutubeContextType {
  latestVideos: YoutubeVideo[];
  loadingVideos: boolean;
  fetchVideos: () => Promise<void>;
}

const YoutubeContext = createContext<YoutubeContextType | undefined>(undefined);

export const YoutubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [latestVideos, setLatestVideos] = useState<YoutubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  const fetchVideos = useCallback(async () => {
    setLoadingVideos(true);
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('유튜브 데이터 로딩 실패:', error.message);
    } else {
      setLatestVideos(data || []);
    }
    setLoadingVideos(false);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <YoutubeContext.Provider value={{ latestVideos, loadingVideos, fetchVideos }}>
      {children}
    </YoutubeContext.Provider>
  );
};

export const useYoutube = () => {
  const context = useContext(YoutubeContext);
  if (!context) throw new Error('useYoutube must be used within a YoutubeProvider');
  return context;
};
import { supabase } from './supabase';

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || ''; 

export const syncLatestVideos = async () => {
    try {
        const { data: channels, error: channelError } = await supabase
        .from('youtube_channels')
        .select('*');

        if (channelError || !channels || channels.length === 0) return;

        for (const channel of channels) {
            const lastSync = channel.last_sync_at ? new Date(channel.last_sync_at).getTime() : 0;
            const now = new Date().getTime();

            // 1시간(3,600,000ms)이 지나지 않았으면 이번 채널은 건너뜀
            if (now - lastSync < 1000 * 60 * 60) continue;

            const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet,id&order=date&maxResults=1&type=video&q=${encodeURIComponent(channel.channel_name)}`;
            
            const response = await fetch(url);
            const result = await response.json();

            if (result.items && result.items.length > 0) {
                const item = result.items[0];
                const videoId = item.id.videoId;

                if (videoId) {
                    const { error: videoError } = await supabase.from('youtube_videos').upsert({
                        video_id: videoId,
                        title: item.snippet.title,
                        description: item.snippet.description,
                        thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                        published_at: item.snippet.publishedAt,
                        channel_id: channel.channel_id,
                    }, { onConflict: 'video_id' });

                    if (!videoError) {
                        // 동기화 성공 시 해당 채널의 동기화 시간 업데이트
                        await supabase
                        .from('youtube_channels')
                        .update({ last_sync_at: new Date().toISOString() })
                        .eq('id', channel.id);
                    }
                }
            }
        }
    } catch (error) {
        // 치명적인 에러만 최소한으로 기록
        console.error('YouTube Sync Error:', error);
    }
};
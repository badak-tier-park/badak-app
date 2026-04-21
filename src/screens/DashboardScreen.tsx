import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, Linking, Image } from 'react-native';
import { supabase } from '../utils/supabase';
import { COLORS } from '../utils/theme';
import { syncLatestVideos } from '../utils/youtubeSync';

export default function DashboardScreen({ navigation }: any) {
    const [leagues, setLeagues] = useState<any[]>([]);
    const [builds, setBuilds] = useState<any[]>([]);
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            await syncLatestVideos();
            const [lRes, bRes, vRes] = await Promise.all([
                supabase.from('leagues').select('*').order('created_at', { ascending: false }).limit(3),
                supabase.from('builds').select('*, build_steps(*)').order('created_at', { ascending: false }).limit(3),
                supabase.from('youtube_videos').select('*').order('published_at', { ascending: false }).limit(1)
            ]);
            console.log('가져온 최신 영상 데이터:', vRes.data?.[0]);
            setLeagues(lRes.data || []);
            setBuilds(bRes.data || []);
            setVideo(vRes.data?.[0] || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openYoutubeVideo = (videoId: string) => {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        Linking.openURL(youtubeUrl);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ScrollView 
            contentContainerStyle={{ padding: 20 }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={[COLORS.primary]} />}
        >
            <Text style={styles.sectionTitle}>신규 리그</Text>
            {leagues.map(item => (
            <TouchableOpacity 
                key={item.id} 
                style={styles.card} 
                onPress={() => navigation.navigate('LeagueSchedule', { league: item })}
            >
                <Text style={styles.cardText}>{item.name}</Text>
                <Text style={styles.cardSubText}>{item.start_date}</Text>
            </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>신규 빌드</Text>
            {builds.map(item => (
            <TouchableOpacity 
                key={item.id} 
                style={styles.card} 
                onPress={() => navigation.navigate('BuildDetail', { item: item })}
            >
                <Text style={styles.cardText}>{item.title}</Text>
                <Text style={styles.cardSubText}>{item.updated_at ? item.updated_at.split('T')[0] : ''}</Text>
            </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>최신 영상</Text>
            {video ? (
            <TouchableOpacity 
                style={styles.videoCard}
                onPress={() => openYoutubeVideo(video.video_id)}
            >
                {/* 썸네일 이미지 영역 */}
                <View style={styles.videoThumbContainer}>
                <Image 
                    source={{ uri: video.thumbnail_url }} 
                    style={styles.videoThumb} 
                    resizeMode="cover"
                />
                <View style={styles.overlay}>
                    <Text style={styles.playIcon}>▶️</Text>
                </View>
                </View>

                <View style={styles.videoInfo}>
                <Text style={styles.cardText} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoDate}>
                    {new Date(video.published_at).toLocaleDateString()} 업로드
                </Text>
                <Text style={styles.youtubeLink}>YouTube에서 시청하기</Text>
                </View>
            </TouchableOpacity>
            ) : (
            <Text style={{ color: 'gray', padding: 10 }}>등록된 최신 영상이 없습니다.</Text>
            )}
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
    card: { backgroundColor: COLORS.card, padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
    cardText: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
    cardSubText: { color: COLORS.primary, fontSize: 12, marginTop: 4 },
    videoCard: { 
        backgroundColor: COLORS.card, 
        borderRadius: 12, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: COLORS.border,
        marginBottom: 30, // 하단 여백 추가
    },
    videoThumbContainer: {
        width: '100%',
        height: 180,
        position: 'relative',
    },
    videoThumb: { 
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)', // 이미지 위 살짝 어두운 효과
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: { 
        fontSize: 40,
    },
    videoInfo: { 
        padding: 15 
    },
    videoDate: { 
        color: 'gray', 
        fontSize: 12, 
        marginTop: 6 
    },
    youtubeLink: { 
        color: COLORS.primary, 
        fontSize: 13, 
        marginTop: 10, 
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }
});
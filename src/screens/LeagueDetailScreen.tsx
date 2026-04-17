import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../utils/supabase';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

const { width } = Dimensions.get('window');

// HTML 태그 제거 및 텍스트 정리 함수
const stripHtml = (html: string) => {
    if (!html) return '';
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
};

type Props = NativeStackScreenProps<RootStackParamList, 'LeagueDetail'>;

export default function LeagueDetailScreen({ route }: Props) {
    // navigate 시 전달받은 params (안전하게 처리)
    const { league, schedule } = route.params || {};
    
    const [matchEntries, setMatchEntries] = useState<any[]>([]);
    const [matchResults, setMatchResults] = useState<any[]>([]);
    const [allMaps, setAllMaps] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // 날짜 데이터가 없으면 예외 처리
    if (!schedule) {
        return (
            <SafeAreaView style={commonStyles.safeArea}>
                <View style={styles.centered}><Text>경기 정보가 없습니다.</Text></View>
            </SafeAreaView>
        );
    }

    const getPlayerNames = (playerIds: any) => {
        if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) return '미등록';
        return playerIds
            .map(pid => allUsers.find(u => String(u.id) === String(pid))?.nickname || `ID:${pid}`)
            .join(', ');
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // 현재 스케줄(날짜)에 해당하는 데이터만 병렬 로드
            const [mapsRes, usersRes, entriesRes, resultsRes] = await Promise.all([
                supabase.from('maps').select('id, name'),
                supabase.from('users').select('id, nickname'),
                supabase.from('league_match_entries').select('*').eq('schedule_id', schedule.id),
                supabase.from('league_match_slot_results').select('*').eq('schedule_id', schedule.id)
            ]);

            setAllMaps(mapsRes.data || []);
            setAllUsers(usersRes.data || []);
            setMatchEntries(entriesRes.data || []);
            setMatchResults(resultsRes.data || []);
        } catch (err: any) {
            console.error('Data loading error:', err.message);
        } finally {
            setLoading(false);
        }
    }, [schedule.id]);

    useEffect(() => { loadData(); }, [loadData]);

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <ScrollView 
                style={commonStyles.container}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={[COLORS.primary]} />}
            >
                {/* 상단 타이틀 (한 줄 조절 적용) */}
                <View style={styles.header}>
                    <Text 
                        style={styles.title} 
                        numberOfLines={1} 
                        adjustsFontSizeToFit 
                        minimumFontScale={0.7}
                    >
                        {schedule.match_date} 경기 결과
                    </Text>
                    <Text style={styles.subInfo}>{league?.name} - {schedule.round}라운드</Text>
                </View>

                {/* 리그 규칙/설명 섹션 */}
                {league?.description && (
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>리그 안내</Text>
                        <View style={[!isExpanded && { maxHeight: 80, overflow: 'hidden' }]}>
                            <Text style={styles.descriptionText}>
                                {stripHtml(league.description)}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.expandButton}>
                            <Text style={styles.expandButtonText}>{isExpanded ? '접기 ▲' : '더보기 ▼'}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 경기 상세 대진표 */}
                <View style={styles.matchSection}>
                    <Text style={styles.sectionTitle}>상세 스코어</Text>
                    {league?.league_match_maps?.length > 0 ? (
                        league.league_match_maps
                            .sort((a: any, b: any) => a.match_number - b.match_number)
                            .map((matchMap: any, idx: number) => {
                                const slotEntries = matchEntries.filter(e => Number(e.match_slot) === Number(matchMap.match_number));
                                const result = matchResults.find(r => Number(r.slot_num) === Number(matchMap.match_number));
                                
                                const entryA = slotEntries[0];
                                const entryB = slotEntries[1];
                                const isWinnerA = result?.winner_captain_id && entryA && String(result.winner_captain_id) === String(entryA.captain_player_id);
                                const isWinnerB = result?.winner_captain_id && entryB && String(result.winner_captain_id) === String(entryB.captain_player_id);

                                const mapNames = (matchMap.map_ids || [])
                                    .map((id: string) => allMaps.find(m => String(m.id) === String(id))?.name)
                                    .filter(Boolean).join(', ');

                                return (
                                    <View key={idx} style={styles.matchCard}>
                                        <View style={styles.matchCardHeader}>
                                            <Text style={styles.matchVol}>SET {matchMap.match_number}</Text>
                                            <Text style={styles.matchMapName} numberOfLines={1}>{mapNames || '전장 미정'}</Text>
                                        </View>
                                        <View style={styles.vsContainer}>
                                            <View style={styles.playerSide}>
                                                <Text style={[styles.playerNick, isWinnerA && styles.winnerHighlight]}>
                                                    {getPlayerNames(entryA?.player_ids)}
                                                </Text>
                                                {isWinnerA && <View style={styles.winTag}><Text style={styles.winTagText}>WIN</Text></View>}
                                            </View>
                                            <Text style={styles.vsLabel}>VS</Text>
                                            <View style={styles.playerSide}>
                                                <Text style={[styles.playerNick, isWinnerB && styles.winnerHighlight]}>
                                                    {getPlayerNames(entryB?.player_ids)}
                                                </Text>
                                                {isWinnerB && <View style={styles.winTag}><Text style={styles.winTagText}>WIN</Text></View>}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                    ) : (
                        <Text style={styles.emptyText}>세트 정보가 없습니다.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
    subInfo: { fontSize: 13, color: COLORS.primary, marginTop: 4, fontWeight: '600' },
    descriptionSection: { backgroundColor: COLORS.card, margin: 16, padding: 16, borderRadius: 12 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.primary, paddingLeft: 8 },
    descriptionText: { fontSize: 13, color: COLORS.subText, lineHeight: 18 },
    expandButton: { marginTop: 10, alignItems: 'center', paddingTop: 8, borderTopWidth: 0.5, borderTopColor: COLORS.border },
    expandButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
    matchSection: { paddingHorizontal: 16, paddingBottom: 20 },
    matchCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
    matchCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, paddingBottom: 6 },
    matchVol: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
    matchMapName: { fontSize: 11, color: COLORS.subText, flex: 1, textAlign: 'right', marginLeft: 10 },
    vsContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    playerSide: { flex: 1, alignItems: 'center' },
    playerNick: { fontSize: 14, color: COLORS.text, fontWeight: '600', textAlign: 'center' },
    winnerHighlight: { color: COLORS.primary },
    vsLabel: { marginHorizontal: 10, fontSize: 12, fontWeight: 'bold', color: COLORS.subText },
    winTag: { backgroundColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
    winTagText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: COLORS.subText, marginTop: 20 }
});
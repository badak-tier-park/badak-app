import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, League, LeagueMatchSlotResult } from '../types';
import { useLeagues } from '../context/LeagueContext';
import { supabase } from '../utils/supabase';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LeagueDetail'>;

export default function LeagueDetailScreen({ route }: Props) {
    const { league: initialLeague } = route.params;
    const { fetchLeagueById } = useLeagues();
    
    const [league, setLeague] = useState<League>(initialLeague);
    const [matchEntries, setMatchEntries] = useState<any[]>([]);
    const [matchResults, setMatchResults] = useState<LeagueMatchSlotResult[]>([]);
    const [loading, setLoading] = useState(false);

    // 참여자 명단에서 닉네임을 찾는 함수
    const getNickname = (id: any) => {
        if (!id) return '대기 중';
        // 배열 형태로 들어오는 경우를 대비해 첫 번째 요소 추출
        const targetId = Array.isArray(id) ? id[0] : id;
        
        const found = league.league_captains?.find(
            (c: any) => String(c.player_id) === String(targetId)
        );
        return found?.player?.nickname || `ID: ${targetId}`;
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const freshData = await fetchLeagueById(initialLeague.id);
            if (freshData) setLeague(freshData);

            // 1. 대진 엔트리 로드
            const { data: entries } = await supabase
                .from('league_match_entries')
                .select('*')
                .eq('schedule_id', initialLeague.id);
            setMatchEntries(entries || []);

            // 2. 경기 결과 로드 (쿼리 결과에 맞게 schedule_id로 필터링)
            const { data: results } = await supabase
                .from('league_match_slot_results')
                .select('*')
                .eq('schedule_id', initialLeague.id);
            setMatchResults((results as LeagueMatchSlotResult[]) || []);

        } catch (err) {
            console.error('Data Load Error:', err);
        } finally {
            setLoading(false);
        }
    }, [initialLeague.id, fetchLeagueById]);

    useEffect(() => {
        loadData();
    }, []);

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <ScrollView 
                style={commonStyles.container}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={[COLORS.primary]} />}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{league.name}</Text>
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}><Text style={styles.badgeText}>{league.type}</Text></View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>경기 결과 및 대진표</Text>
                    {league.league_match_maps?.sort((a, b) => a.match_number - b.match_number).map((matchMap, idx) => {
                        // 현재 슬롯(SET) 번호와 일치하는 데이터 필터링
                        const slotEntries = matchEntries.filter(
                            e => Number(e.match_slot) === Number(matchMap.match_number)
                        );
                        
                        const result = matchResults.find(
                            r => Number(r.slot_num) === Number(matchMap.match_number)
                        );

                        // player_ids 배열 대응
                        const playerAId = slotEntries[0]?.player_ids;
                        const playerBId = slotEntries[1]?.player_ids;

                        // 승자 판독 (ID를 문자열로 통일하여 비교)
                        const isWinnerA = result?.winner_captain_id && playerAId && 
                                          String(result.winner_captain_id) === String(Array.isArray(playerAId) ? playerAId[0] : playerAId);
                        const isWinnerB = result?.winner_captain_id && playerBId && 
                                          String(result.winner_captain_id) === String(Array.isArray(playerBId) ? playerBId[0] : playerBId);

                        return (
                            <View key={idx} style={styles.matchCard}>
                                <View style={styles.matchHeader}>
                                    <Text style={styles.matchVol}>SET {matchMap.match_number}</Text>
                                    <Text style={styles.matchMapName}>🗺 {matchMap.maps?.[0]?.name || '전장 미정'}</Text>
                                </View>

                                <View style={styles.vsContainer}>
                                    <View style={styles.playerSide}>
                                        <Text style={[styles.playerNick, isWinnerA ? styles.winnerHighlight : null]}>
                                            {getNickname(playerAId)}
                                        </Text>
                                        {isWinnerA && (
                                            <View style={styles.winTag}><Text style={styles.winTagText}>WIN</Text></View>
                                        )}
                                    </View>

                                    <Text style={styles.vsLabel}>VS</Text>

                                    <View style={styles.playerSide}>
                                        <Text style={[styles.playerNick, isWinnerB ? styles.winnerHighlight : null]}>
                                            {getNickname(playerBId)}
                                        </Text>
                                        {isWinnerB && (
                                            <View style={styles.winTag}><Text style={styles.winTagText}>WIN</Text></View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>참여 선수</Text>
                    <View style={styles.playerList}>
                        {league.league_captains?.map((cap, i) => (
                            <View key={i} style={styles.playerChip}>
                                <Text style={styles.capSign}>C</Text>
                                <Text style={styles.chipText}>{cap.player?.nickname}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: { marginBottom: 20, paddingHorizontal: 4 },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
    badgeContainer: { flexDirection: 'row' },
    badge: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    section: { backgroundColor: COLORS.card, padding: 16, borderRadius: 12, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: COLORS.primary, paddingLeft: 10 },
    matchCard: { backgroundColor: COLORS.surface, borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
    matchHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, paddingBottom: 8 },
    matchVol: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
    matchMapName: { fontSize: 12, color: COLORS.subText },
    vsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
    playerSide: { flex: 1, alignItems: 'center' },
    playerNick: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
    winnerHighlight: { color: COLORS.primary, fontWeight: 'bold' },
    vsLabel: { marginHorizontal: 15, fontSize: 14, fontWeight: 'bold', color: COLORS.subText },
    winTag: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
    winTagText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    playerList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    playerChip: { flexDirection: 'row', backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    capSign: { color: '#E74C3C', fontWeight: 'bold', marginRight: 4, fontSize: 12 },
    chipText: { fontSize: 13, color: COLORS.text }
});
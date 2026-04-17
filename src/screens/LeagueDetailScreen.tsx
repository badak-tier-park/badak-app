import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../utils/supabase';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

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
    const { league, schedule } = route.params || {};
    
    const [matchEntries, setMatchEntries] = useState<any[]>([]);
    const [matchResults, setMatchResults] = useState<any[]>([]);
    const [allMaps, setAllMaps] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [teamNames, setTeamNames] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // 무한 루프를 방지하기 위해 deps에서 schedule과 league를 제거하고 마운트 시 1회 실행 유도
    const loadData = async () => {
        if (!schedule?.id) return;
        setLoading(true);
        try {
            const [mapsRes, usersRes, entriesRes, resultsRes, teamsRes] = await Promise.all([
                supabase.from('maps').select('id, name'),
                supabase.from('users').select('id, nickname'),
                supabase.from('league_match_entries').select('*').eq('schedule_id', schedule.id),
                supabase.from('league_match_slot_results').select('*').eq('schedule_id', schedule.id),
                supabase.from('league_team_names').select('captain_player_id, team_name').eq('league_id', league?.id)
            ]);

            setAllMaps(mapsRes.data || []);
            setAllUsers(usersRes.data || []);
            setMatchEntries(entriesRes.data || []);
            setMatchResults(resultsRes.data || []);
            setTeamNames(teamsRes.data || []);
        } catch (err: any) {
            console.error('Data loading error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // 의존성 배열을 비워서 딱 한 번만 실행되게 고정 (무한 새로고침 해결 핵심)
    useEffect(() => {
        loadData();
    }, []);

    const findNickname = (id: any) => {
        if (!id) return '미등록';
        const user = allUsers.find(u => String(u.id) === String(id));
        return user ? user.nickname : `ID:${id}`;
    };

    const getTeamNameByCaptain = (captainId: any) => {
        if (!captainId) return '팀미정';
        const team = teamNames.find(t => String(t.captain_player_id) === String(captainId));
        return team ? team.team_name : '팀미정';
    };

    const getTeamNameByUserId = (userId: any) => {
        if (!userId) return '팀미정';
        const userEntry = matchEntries.find(e => 
            e.player_ids && e.player_ids.some((pid: any) => String(pid) === String(userId))
        );
        return userEntry ? getTeamNameByCaptain(userEntry.captain_player_id) : '팀미정';
    };

    if (!schedule) {
        return (
            <SafeAreaView style={commonStyles.safeArea}>
                <View style={styles.centered}><Text style={{color: COLORS.text}}>경기 정보가 없습니다.</Text></View>
            </SafeAreaView>
        );
    }

    const aceResult = matchResults.find(r => Number(r.slot_num) === 7);
    const aceMapName = allMaps.find(m => String(m.id) === String(aceResult?.selected_map_id))?.name;

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <ScrollView 
                style={commonStyles.container}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={[COLORS.primary]} />}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{schedule.match_date} 경기 결과</Text>
                    <Text style={styles.subInfo}>{league?.name} - {schedule.round}라운드</Text>
                </View>

                {league?.description && (
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>리그 안내</Text>
                        <View style={[!isExpanded && { maxHeight: 80, overflow: 'hidden' }]}>
                            <Text style={styles.descriptionText}>{stripHtml(league.description)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.expandButton}>
                            <Text style={styles.expandButtonText}>{isExpanded ? '접기 ▲' : '더보기 ▼'}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.matchSection}>
                    <Text style={styles.sectionTitle}>상세 스코어</Text>
                    
                    {league?.league_match_maps?.length > 0 && 
                        league.league_match_maps
                            .sort((a: any, b: any) => Number(a.match_number) - Number(b.match_number))
                            .map((matchMap: any, idx: number) => {
                                const currentSlot = Number(matchMap.match_number);
                                if (currentSlot === 7) return null;

                                const slotEntries = matchEntries.filter(e => Number(e.match_slot) === currentSlot);
                                const result = matchResults.find(r => Number(r.slot_num) === currentSlot);
                                
                                // 주장 ID 기반 매칭
                                let entryA = slotEntries.find(e => String(e.captain_player_id) === String(schedule.ace_player_a_captain_id));
                                let entryB = slotEntries.find(e => String(e.captain_player_id) === String(schedule.ace_player_b_captain_id));

                                // 데이터가 한 팀분(6개)만 있을 경우를 대비한 순서 강제 할당
                                if (!entryA && slotEntries.length > 0) entryA = slotEntries[0];
                                if (!entryB && slotEntries.length > 1) entryB = slotEntries[1];

                                const winA = result?.winner_captain_id && entryA && String(result.winner_captain_id) === String(entryA.captain_player_id);
                                const winB = result?.winner_captain_id && entryB && String(result.winner_captain_id) === String(entryB.captain_player_id);

                                const mapNames = (matchMap.map_ids || [])
                                    .map((id: string) => allMaps.find(m => String(m.id) === String(id))?.name)
                                    .filter(Boolean).join(', ');

                                return (
                                    <View key={`match-view-${idx}`} style={styles.matchCard}>
                                        <View style={styles.matchCardHeader}>
                                            <Text style={styles.matchVol}>SET {currentSlot}</Text>
                                            <Text style={styles.matchMapName}>{mapNames || '전장 미정'}</Text>
                                        </View>
                                        <View style={styles.vsContainer}>
                                            <View style={styles.playerSide}>
                                                <Text style={[styles.playerNick, winA && styles.winnerHighlight]}>
                                                    {entryA?.player_ids 
                                                        ? entryA.player_ids.map((pid: any) => `[${getTeamNameByCaptain(entryA?.captain_player_id)}] ${findNickname(pid)}`).join(', ')
                                                        : '미등록'}
                                                </Text>
                                                {winA && <View style={styles.winTag}><Text style={styles.winTagText}>WIN</Text></View>}
                                            </View>
                                            <Text style={styles.vsLabel}>VS</Text>
                                            <View style={styles.playerSide}>
                                                <Text style={[styles.playerNick, winB && styles.winnerHighlight]}>
                                                    {entryB?.player_ids 
                                                        ? entryB.player_ids.map((pid: any) => `[${getTeamNameByCaptain(entryB?.captain_player_id)}] ${findNickname(pid)}`).join(', ')
                                                        : '미등록'}
                                                </Text>
                                                {winB && <View style={styles.winTag}><Text style={styles.winTagText}>WIN</Text></View>}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                    }

                    {aceResult && (
                        <View style={[styles.matchCard, styles.aceCard]}>
                            <View style={styles.matchCardHeader}>
                                <View style={styles.aceBadge}>
                                    <Text style={styles.aceBadgeText}>ACE 결정전 ({aceResult.ace_tier || '??'}티어)</Text>
                                </View>
                                <Text style={styles.matchMapName}>{aceMapName || '전장 미정'}</Text>
                            </View>
                            <View style={styles.vsContainer}>
                                <View style={styles.playerSide}>
                                    <Text style={[styles.playerNick, {color: COLORS.text}]}>
                                        {`[${getTeamNameByUserId(aceResult.ace_player_a_id)}] ${findNickname(aceResult.ace_player_a_id)}`}
                                    </Text>
                                </View>
                                <Text style={styles.vsLabel}>VS</Text>
                                <View style={styles.playerSide}>
                                    <Text style={[styles.playerNick, {color: COLORS.text}]}>
                                        {`[${getTeamNameByUserId(aceResult.ace_player_b_id)}] ${findNickname(aceResult.ace_player_b_id)}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
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
    matchSection: { paddingHorizontal: 16, paddingBottom: 20, marginTop: 10 },
    matchCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
    aceCard: { borderColor: COLORS.primary, borderWidth: 1.5 },
    matchCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, paddingBottom: 6, alignItems: 'center' },
    matchVol: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
    aceBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    aceBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    matchMapName: { fontSize: 11, color: COLORS.subText, flex: 1, textAlign: 'right', marginLeft: 10 },
    vsContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    playerSide: { flex: 1, alignItems: 'center' },
    playerNick: { fontSize: 12, color: COLORS.text, fontWeight: '600', textAlign: 'center' },
    winnerHighlight: { color: COLORS.primary },
    vsLabel: { marginHorizontal: 10, fontSize: 12, fontWeight: 'bold', color: COLORS.subText },
    winTag: { backgroundColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
    winTagText: { color: '#fff', fontSize: 9, fontWeight: 'bold' }
});
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../utils/supabase';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LeagueDetail'>;

export default function LeagueDetailScreen({ route }: Props) {
    const { league, schedule } = route.params || {};
    
    const [matchEntries, setMatchEntries] = useState<any[]>([]);
    const [matchResults, setMatchResults] = useState<any[]>([]);
    const [allMaps, setAllMaps] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [teamNames, setTeamNames] = useState<any[]>([]);
    const [draftPicks, setDraftPicks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        if (!schedule?.id || !league?.id) return;
        setLoading(true);
        try {
            const [mapsRes, usersRes, entriesRes, resultsRes, teamsRes, draftRes] = await Promise.all([
                supabase.from('maps').select('id, name'),
                supabase.from('users').select('id, nickname'),
                supabase.from('league_match_entries').select('*').eq('schedule_id', schedule.id),
                supabase.from('league_match_slot_results').select('*').eq('schedule_id', schedule.id),
                supabase.from('league_team_names').select('captain_player_id, team_name').eq('league_id', league.id),
                supabase.from('league_draft_picks').select('captain_player_id, member_player_id').eq('league_id', league.id)
            ]);

            setAllMaps(mapsRes.data || []);
            setAllUsers(usersRes.data || []);
            setMatchEntries(entriesRes.data || []);
            setMatchResults(resultsRes.data || []);
            setTeamNames(teamsRes.data || []);
            setDraftPicks(draftRes.data || []);
        } catch (err: any) {
            console.error('Data loading error:', err.message);
        } finally {
            setLoading(false);
        }
    };

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

    const getAceTeamName = (pId: any) => {
        if (!pId) return '팀미정';
        const sId = String(pId);
        const asCaptain = teamNames.find(t => String(t.captain_player_id) === sId);
        if (asCaptain) return asCaptain.team_name;

        const pickInfo = draftPicks.find(p => String(p.member_player_id) === sId);
        if (pickInfo) return getTeamNameByCaptain(pickInfo.captain_player_id);
        return '팀미정';
    };

    // 단일 ID 또는 ID 배열을 받아 맵 이름을 반환하는 함수
    const getMapNames = (mapData: any) => {
        if (!mapData) return '맵 미정';
        
        if (Array.isArray(mapData)) {
            return mapData
                .map(id => allMaps.find(m => String(m.id) === String(id))?.name)
                .filter(Boolean)
                .join(', ');
        }
        
        const map = allMaps.find(m => String(m.id) === String(mapData));
        return map ? map.name : '맵 미정';
    };

    if (!schedule) return null;

    const aceResult = matchResults.find(r => Number(r.slot_num) === 7);

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
                                
                                let entryA = slotEntries.find(e => String(e.captain_player_id) === String(schedule.ace_player_a_captain_id));
                                let entryB = slotEntries.find(e => String(e.captain_player_id) === String(schedule.ace_player_b_captain_id));

                                if (!entryA && slotEntries.length > 0) entryA = slotEntries[0];
                                if (!entryB && slotEntries.length > 1) entryB = slotEntries[1];

                                const winA = result?.winner_captain_id && entryA && String(result.winner_captain_id) === String(entryA.captain_player_id);
                                const winB = result?.winner_captain_id && entryB && String(result.winner_captain_id) === String(entryB.captain_player_id);

                                return (
                                    <View key={`match-view-${idx}`} style={styles.matchCard}>
                                        <View style={styles.matchCardHeader}>
                                            <Text style={styles.matchVol}>SET {currentSlot}</Text>
                                            {/* map_ids 배열에서 맵 이름들을 추출하여 표시 */}
                                            <Text style={styles.matchMapName}>{getMapNames(matchMap.map_ids)}</Text>
                                        </View>
                                        <View style={styles.vsContainer}>
                                            <View style={styles.playerSide}>
                                                <Text style={[styles.playerNick, winA && styles.winnerHighlight]}>
                                                    {entryA?.player_ids 
                                                        ? entryA.player_ids.map((pid: any) => `[${getTeamNameByCaptain(entryA?.captain_player_id)}] ${findNickname(pid)}`).join('\n')
                                                        : '미등록'}
                                                </Text>
                                            </View>
                                            <Text style={styles.vsLabel}>VS</Text>
                                            <View style={styles.playerSide}>
                                                <Text style={[styles.playerNick, winB && styles.winnerHighlight]}>
                                                    {entryB?.player_ids 
                                                        ? entryB.player_ids.map((pid: any) => `[${getTeamNameByCaptain(entryB?.captain_player_id)}] ${findNickname(pid)}`).join('\n')
                                                        : '미등록'}
                                                </Text>
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
                                <Text style={styles.matchMapName}>{getMapNames(aceResult.selected_map_id)}</Text>
                            </View>
                            <View style={styles.vsContainer}>
                                <View style={styles.playerSide}>
                                    <Text style={[styles.playerNick, {color: COLORS.text}]}>
                                        {`[${getAceTeamName(aceResult.ace_player_a_id)}]\n${findNickname(aceResult.ace_player_a_id)}`}
                                    </Text>
                                </View>
                                <Text style={styles.vsLabel}>VS</Text>
                                <View style={styles.playerSide}>
                                    <Text style={[styles.playerNick, {color: COLORS.text}]}>
                                        {`[${getAceTeamName(aceResult.ace_player_b_id)}]\n${findNickname(aceResult.ace_player_b_id)}`}
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
    header: { padding: 20, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
    subInfo: { fontSize: 13, color: COLORS.primary, marginTop: 4, fontWeight: '600' },
    matchSection: { paddingHorizontal: 16, paddingBottom: 20, marginTop: 10 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.primary, paddingLeft: 8 },
    matchCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
    aceCard: { borderColor: COLORS.primary, borderWidth: 1.5 },
    matchCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, paddingBottom: 6, alignItems: 'center' },
    matchVol: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
    aceBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    aceBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    matchMapName: { fontSize: 11, color: COLORS.subText, fontWeight: '500', flex: 1, textAlign: 'right', marginLeft: 10 },
    vsContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    playerSide: { flex: 1, alignItems: 'center' },
    playerNick: { fontSize: 12, color: COLORS.text, fontWeight: '600', textAlign: 'center' },
    winnerHighlight: { color: COLORS.primary },
    vsLabel: { marginHorizontal: 10, fontSize: 12, fontWeight: 'bold', color: COLORS.subText }
});
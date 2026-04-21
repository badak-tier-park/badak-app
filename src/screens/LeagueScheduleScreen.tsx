import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../utils/supabase';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LeagueSchedule'>;

export default function LeagueScheduleScreen({ route, navigation }: Props) {
    // 파라미터가 없을 경우를 대비해 빈 객체 처리
    const { league } = route.params || {};
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadSchedules = useCallback(async () => {
        if (!league?.id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('league_schedules')
                .select('*')
                .eq('league_id', league.id)
                .order('match_date', { ascending: true });
            if (error) throw error;
            setSchedules(data || []);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [league?.id]);

    useEffect(() => { loadSchedules(); }, [loadSchedules]);

    if (!league) {
        return (
            <SafeAreaView style={[commonStyles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: COLORS.text }}>리그 정보가 없습니다.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{league.name}</Text>
                <Text style={styles.subText}>경기 일정을 선택하세요</Text>
            </View>
            <ScrollView 
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadSchedules} colors={[COLORS.primary]} />}
            >
                {schedules.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.scheduleItem}
                        onPress={() => navigation.navigate('LeagueDetail', { league, schedule: item })}
                    >
                        <View>
                            <Text style={styles.dateText}>
                                {item.match_date ? item.match_date.split('T')[0] : '일정 미정'}
                            </Text>
                            <Text style={styles.roundText}>{item.round} 라운드</Text>
                        </View>
                        <Text style={styles.arrow}>&gt;</Text>
                    </TouchableOpacity>
                ))}
                {schedules.length === 0 && !loading && (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <Text style={{ color: COLORS.subText }}>등록된 경기 일정이 없습니다.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
    subText: { fontSize: 13, color: COLORS.subText, marginTop: 4 },
    scheduleItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: COLORS.card, 
        marginHorizontal: 16, 
        marginTop: 12, 
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primary
    },
    dateText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    roundText: { fontSize: 13, color: COLORS.subText, marginTop: 2 },
    arrow: { fontSize: 18, color: COLORS.subText }
});
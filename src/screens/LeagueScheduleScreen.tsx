import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../utils/supabase';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LeagueSchedule'>;

export default function LeagueScheduleScreen({ route, navigation }: Props) {
    const { league } = route.params;
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadSchedules = useCallback(async () => {
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
    }, [league.id]);

    useEffect(() => { loadSchedules(); }, [loadSchedules]);

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
                            <Text style={styles.dateText}>{item.match_date}</Text>
                            <Text style={styles.roundText}>{item.round} 라운드</Text>
                        </View>
                        <Text style={styles.arrow}>&gt;</Text>
                    </TouchableOpacity>
                ))}
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
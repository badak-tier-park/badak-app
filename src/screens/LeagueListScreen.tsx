import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, League } from '../types';
import { useLeagues } from '../context/LeagueContext';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = BottomTabScreenProps<RootStackParamList, 'Leagues'>;

// HTML 태그 제거용 헬퍼 함수
const stripHtml = (html: string | null) => {
    if (!html) return '';
    return html
        .replace(/<[^>]*>?/gm, '') // 태그 제거
        .replace(/&nbsp;/g, ' ')   // 공백 문자 처리
        .replace(/\s\s+/g, ' ')    // 연속 공백 제거
        .trim();
};

export default function LeagueListScreen({ navigation }: Props) {
    const { leagues, loadingLeagues, fetchLeagues } = useLeagues();

    // 화면 진입 시 데이터가 없으면 로드
    useEffect(() => {
        if (leagues.length === 0) {
            fetchLeagues();
        }
    }, []);

    const renderLeagueItem = ({ item }: { item: League }) => (
        <TouchableOpacity 
            style={styles.leagueCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('LeagueDetail', { league: item })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.leagueName}>{item.name}</Text>
                <Text style={styles.leagueType}>
                    {item.type === 'regular_summer' ? '정규 여름' : 
                     item.type === 'regular_winter' ? '정규 겨울' : 
                     item.type === 'jongchoe' ? '종최' : item.type}
                </Text>
            </View>

            {item.description && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.leagueDescription} numberOfLines={2}>
                        {stripHtml(item.description)}
                    </Text>
                </View>
            )}

            <View style={styles.cardFooter}>
                <Text style={styles.leagueDates}>{item.start_date} ~ {item.end_date}</Text>
                {item.has_draft && (
                    <Text style={styles.draftStatus}>
                        드래프트 {item.draft_completed ? '완료' : '예정'}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <View style={commonStyles.container}>
                <Text style={styles.headerTitle}>리그 목록</Text>
                
                {/* 로딩 중이면서 데이터가 아예 없을 때만 전체 화면 로딩 표시 */}
                {loadingLeagues && leagues.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={leagues}
                        keyExtractor={(item) => item.id}
                        renderItem={renderLeagueItem}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl 
                                refreshing={loadingLeagues} 
                                onRefresh={fetchLeagues} 
                                colors={[COLORS.primary]}
                            />
                        }
                        ListEmptyComponent={
                            !loadingLeagues ? (
                                <View style={styles.centerContainer}>
                                    <Text style={styles.emptyText}>등록된 리그가 없습니다.</Text>
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    listContainer: {
        paddingBottom: 20,
    },
    leagueCard: {
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    leagueName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        flexShrink: 1,
    },
    leagueType: {
        fontSize: 12,
        color: COLORS.subText,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        marginLeft: 10,
    },
    descriptionContainer: {
        marginBottom: 10,
        paddingTop: 5,
    },
    leagueDescription: {
        fontSize: 13,
        color: COLORS.subText,
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
        paddingTop: 8,
    },
    leagueDates: {
        fontSize: 12,
        color: COLORS.subText,
    },
    draftStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.subText,
    },
});
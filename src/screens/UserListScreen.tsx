import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, User } from '../types';
import { useUsers } from '../context/UserContext';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';
import { RaceBadge } from '../components/RaceBadge';

type Props = BottomTabScreenProps<RootStackParamList, 'Users'>;

export default function UserListScreen({ navigation }: Props) {
    const { users, loadingUsers, filterUsers } = useUsers();
    const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);
    const [selectedRace, setSelectedRace] = useState<'T' | 'Z' | 'P' | undefined>(undefined);
    const [showTierModal, setShowTierModal] = useState(false);
    const [showRaceModal, setShowRaceModal] = useState(false);

    const tierOptions = ['S', 'A', 'B', 'C', 'D', 'E'];
    const raceOptions: ('T' | 'Z' | 'P')[] = ['T', 'Z', 'P'];

    useEffect(() => {
        filterUsers(selectedTier, selectedRace);
    }, [selectedTier, selectedRace]);

    const renderUserItem = ({ item }: { item: User }) => (
        <View style={styles.userCard}>
            <RaceBadge race={item.race || 'T'} />
            <View style={styles.userInfo}>
                <View style={styles.headerRow}>
                    <Text style={styles.nickname}>{item.nickname || 'Unknown'}</Text>
                    <Text style={styles.tierText}>{item.tier}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <View style={[commonStyles.container, { flex: 1 }]}>
                {/* 필터 영역 */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setShowTierModal(true)}>
                        <Text style={styles.filterButtonText}>{selectedTier || "티어"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setShowRaceModal(true)}>
                        <Text style={styles.filterButtonText}>
                            {selectedRace === 'T' ? '테란' : selectedRace === 'Z' ? '저그' : selectedRace === 'P' ? '토스' : '종족'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => { setSelectedTier(undefined); setSelectedRace(undefined); }} 
                        style={styles.resetButton}
                    >
                        <Text style={styles.resetButtonText}>초기화</Text>
                    </TouchableOpacity>
                </View>

                {loadingUsers ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderUserItem}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>등록된 유저가 없습니다.</Text>}
                    />
                )}
            </View>

            {/* 모달 생략 (동일) */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 15,
        marginTop: 5,
    },
    filterButton: {
        backgroundColor: COLORS.surface,
        paddingVertical: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    filterButtonText: {
        color: COLORS.text,
        fontSize: 14,
    },
    resetButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nickname: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    tierText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    loadingIndicator: {
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.subText,
        marginTop: 50,
        fontSize: 15,
    },
});
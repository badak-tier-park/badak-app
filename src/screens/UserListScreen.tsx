import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, User } from '../types';
import { useUsers } from '../context/UserContext';
import { commonStyles } from '../utils/commonStyles';
import { COLORS, getRaceColor } from '../utils/theme';
import { RaceBadge } from '../components/RaceBadge';

type Props = BottomTabScreenProps<RootStackParamList, 'Users'>;

export default function UserListScreen({ navigation, route }: Props) {
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

    const resetFilters = () => {
        setSelectedTier(undefined);
        setSelectedRace(undefined);
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <View style={styles.userCard}>
            <RaceBadge race={item.race || 'T'} />
            <View style={styles.userInfo}>
                <View style={styles.headerRow}>
                    <Text style={styles.nickname}>{item.nickname || 'Unknown User'}</Text>
                    <View style={styles.tierRaceRow}>
                        {item.tier && <Text style={styles.tierText}>{item.tier}</Text>}
                    </View>
                </View>
            </View>
        </View>
    );

    const FilterButton = ({ label, value, onPress }: any) => (
        <TouchableOpacity style={styles.filterButton} onPress={onPress}>
            <Text style={styles.filterButtonText}>{value || label}</Text>
                    </TouchableOpacity>
    );

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <View style={commonStyles.container}>
                <Text style={styles.headerTitle}>유저 목록</Text>

                <View style={styles.filterContainer}>
                    <FilterButton label="티어" value={selectedTier} onPress={() => setShowTierModal(true)} />
                    <FilterButton label="종족" value={selectedRace} onPress={() => setShowRaceModal(true)} />
                    <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
                        <Text style={styles.resetButtonText}>초기화</Text>
                    </TouchableOpacity>
                </View>

                {/* 티어 선택 모달 */}
                <Modal visible={showTierModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={['모든 티어', ...tierOptions]}
                                keyExtractor={(item) => item}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => {
                                        setSelectedTier(item === '모든 티어' ? undefined : item);
                                        setShowTierModal(false);
                                    }} style={styles.modalItem}>
                                        <Text style={styles.modalItemText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                {/* 종족 선택 모달 */}
                <Modal visible={showRaceModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={['모든 종족', ...raceOptions]}
                                keyExtractor={(item) => item}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => {
                                        setSelectedRace(item === '모든 종족' ? undefined : item as 'T' | 'Z' | 'P');
                                        setShowRaceModal(false);
                                    }} style={styles.modalItem}>
                                        <Text style={styles.modalItemText}>
                                            {item === '모든 종족' ? item : item === 'T' ? '테란' : item === 'Z' ? '저그' : '프로토스'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: COLORS.surface,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    filterButtonText: {
        color: COLORS.text,
    },
    resetButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        justifyContent: 'center',
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        height: '40%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
        color: '#000',
    },
    loadingIndicator: {
        marginTop: 50,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
    },
    nickname: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    tierRaceRow: {
        flexDirection: 'row',
        marginTop: 5,
    },
    tierText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: 10,
    },
    raceText: {
        fontSize: 14,
        color: COLORS.subText,
    },
    discordId: {
        fontSize: 12,
        color: COLORS.subText,
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.subText,
        marginTop: 50,
        fontSize: 16,
    },
});
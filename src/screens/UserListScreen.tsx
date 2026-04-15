import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
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
                <Text style={styles.nickname}>{item.nickname || 'Unknown User'}</Text>
                <View style={styles.tierRaceRow}>
                    {item.tier && <Text style={styles.tierText}>{item.tier}</Text>}
                    {item.race && <Text style={styles.raceText}>({
                        item.race === 'T' ? '테란' :
                        item.race === 'Z' ? '저그' :
                        '프로토스'
                    })</Text>}
                </View>
                {item.discord_id && <Text style={styles.discordId}>Discord ID: {item.discord_id}</Text>}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <View style={commonStyles.container}>
                <Text style={styles.headerTitle}>유저 목록</Text>

                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>티어:</Text>
                    <Picker
                        selectedValue={selectedTier}
                        onValueChange={(itemValue) => setSelectedTier(itemValue || undefined)}
                        style={styles.pickerStyle}
                        itemStyle={styles.pickerItemStyle}
                    >
                        <Picker.Item label="모든 티어" value={undefined} />
                        {tierOptions.map((tier) => (
                            <Picker.Item key={tier} label={tier} value={tier} />
                        ))}
                    </Picker>

                    <Text style={styles.filterLabel}>종족:</Text>
                    <Picker
                        selectedValue={selectedRace}
                        onValueChange={(itemValue) => setSelectedRace(itemValue || undefined)}
                        style={styles.pickerStyle}
                        itemStyle={styles.pickerItemStyle}
                    >
                        <Picker.Item label="모든 종족" value={undefined} />
                        {raceOptions.map((race) => (
                            <Picker.Item key={race} label={race === 'T' ? '테란' : race === 'Z' ? '저그' : '프로토스'} value={race} />
                        ))}
                    </Picker>
                    <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
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
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        paddingVertical: 10,
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    filterLabel: {
        color: COLORS.subText,
        fontSize: 14,
        marginHorizontal: 5,
    },
    pickerStyle: {
        height: 50,
        width: 120,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
    pickerItemStyle: {
        color: COLORS.text,
    },
    resetButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginLeft: 10,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
        fontSize: 14,
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
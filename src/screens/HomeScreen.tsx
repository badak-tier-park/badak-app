import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useBuilds } from '../context/BuildContext';
import { RaceBadge } from '../components/RaceBadge';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { builds } = useBuilds();

    return (
        <View style={commonStyles.safeArea}>
        <FlatList
            data={builds}
            keyExtractor={item => item.id}
            contentContainerStyle={[commonStyles.container, { paddingBottom: 80 }]} // 버튼 공간 확보
            renderItem={({ item }) => (
            <TouchableOpacity 
                style={[commonStyles.card, styles.cardLayout]} 
                onPress={() => navigation.navigate('Detail', { item })}
            >
                <RaceBadge race={item.race} />
                <View style={styles.textContainer}>
                <Text style={styles.matchupText}>{item.matchup}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
            </TouchableOpacity>
            )}
        />

        {/* 글쓰기 플로팅 버튼 */}
        <TouchableOpacity 
            style={styles.fab}
            onPress={() => navigation.navigate('AddBuild')}
        >
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cardLayout: { flexDirection: 'row', alignItems: 'center' },
    textContainer: { marginLeft: 15 },
    matchupText: { color: COLORS.subText, fontSize: 12, marginBottom: 2 },
    cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
    
    // 플로팅 버튼 스타일
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        // 폰에서 그림자 효과
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    fabText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '300',
        marginTop: -2, // '+' 기호 미세 조정
    },
});
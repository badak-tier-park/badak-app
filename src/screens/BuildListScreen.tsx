import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useBuilds } from '../context/BuildContext';
import { RaceBadge } from '../components/RaceBadge'; 
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BuildList'>;

export default function HomeScreen({ navigation }: Props) {
    const { builds, loadingBuilds } = useBuilds();
    return (
        <SafeAreaView style={commonStyles.safeArea}>
        {loadingBuilds ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
        ) : (
        <FlatList
            data={builds}
            keyExtractor={item => item.id}
            contentContainerStyle={[commonStyles.container, { paddingBottom: 80 }]} 
            renderItem={({ item }) => (
            <TouchableOpacity 
                style={[commonStyles.card, styles.cardLayout]} 
                onPress={() => navigation.navigate('BuildDetail', { item })}
            >
                {/* RaceBadge는 item.race를 사용 */}
                <RaceBadge race={item.race} /> 
                <View style={styles.textContainer}>
                {/* item.matchup 제거 */}
                {/* <Text style={styles.matchupText}>{item.matchup}</Text> */} 
                <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
            </TouchableOpacity>
            )}
                ListEmptyComponent={<Text style={styles.emptyText}>등록된 빌드가 없습니다.</Text>}
        />
        )}

        {/* 글쓰기 플로팅 버튼 */}
        <TouchableOpacity 
            style={styles.fab}
            onPress={() => navigation.navigate('AddBuild', {})}
        >
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cardLayout: { flexDirection: 'row', alignItems: 'center' },
    textContainer: { marginLeft: 15 },
    cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
    
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
        marginTop: -2, 
    },
    loadingIndicator: {
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.subText,
        marginTop: 50,
        fontSize: 16,
    },
});
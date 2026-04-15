import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'; // ActivityIndicator 추가
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, BuildItem } from '../types';
import { useBuilds } from '../context/BuildContext'; // useBuilds 훅 임포트
import { RaceBadge } from '../components/RaceBadge'; 
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

// HomeScreen은 RootStackParamList에 정의된 "Home" 스크린의 props를 받습니다.
// Tab Navigator 안에서 Stack Navigator로 렌더링되므로 NativeStackScreenProps를 사용합니다.
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { builds, loadingBuilds } = useBuilds(); // loadingBuilds 상태 사용
    return (
        <SafeAreaView style={commonStyles.safeArea}>
        {loadingBuilds ? ( // 로딩 중일 때 ActivityIndicator 표시
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
        ) : (
        <FlatList
            data={builds}
            keyExtractor={item => item.id}
            contentContainerStyle={[commonStyles.container, { paddingBottom: 80 }]} 
            renderItem={({ item }) => (
            <TouchableOpacity 
                style={[commonStyles.card, styles.cardLayout]} 
                onPress={() => navigation.navigate('Detail', { item })}
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
                ListEmptyComponent={<Text style={styles.emptyText}>등록된 빌드가 없습니다.</Text>} // 빌드가 없을 때 메시지
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
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, BuildItem } from '../types'; // BuildItem 타입 사용
import { useBuilds } from '../context/BuildContext';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';
import { RaceBadge } from '../components/RaceBadge'; 

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { builds } = useBuilds();

    return (
        <SafeAreaView style={commonStyles.safeArea}>
        <FlatList
            data={builds}
            keyExtractor={item => item.id} // id를 key로 사용
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
        />

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
    // matchupText 스타일 제거 (더 이상 사용되지 않음)
    // matchupText: { color: COLORS.subText, fontSize: 12, marginBottom: 2 }, 
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
});
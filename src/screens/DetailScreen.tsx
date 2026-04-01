import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { commonStyles } from '../utils/commonStyles';
import { COLORS, getRaceColor } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
    const { item } = route.params;
    const themeColor = getRaceColor(item.race);

    return (
        <SafeAreaView style={commonStyles.safeArea}>
        <ScrollView contentContainerStyle={commonStyles.container}>
            {/* 중앙 정렬을 위한 내부 컨테이너 */}
            <View style={styles.contentWrapper}>
                <View style={[styles.raceIndicator, { backgroundColor: themeColor }]} />
                <Text style={styles.detailTitle}>{item.title}</Text>
                {/* 표 헤더 */}
            <View style={[commonStyles.card, styles.tableHeader]}>
                <View style={styles.popColumn}>
                    <Text style={[styles.tableHeaderText, { color: themeColor }]}>인구</Text>
                </View>
                <View style={styles.timeColumn}>
                    <Text style={[styles.tableHeaderText, { color: COLORS.subText }]}>시간</Text>
                </View>
                <View style={styles.actionColumn}>
                    <Text style={[styles.tableHeaderText, { color: COLORS.text, textAlign: 'left' }]}>할 일</Text>
                </View>
            </View>

            {/* 빌드 단계 리스트 */}
            {item.buildSteps.map((step, index) => (
                <View key={index} style={styles.tableRow}>
                <View style={styles.popColumn}>
                    <Text style={[styles.popText, { color: themeColor }]}>{step.pop}</Text>
                </View>
                <View style={styles.timeColumn}>
                    <Text style={styles.timeText}>{step.time}</Text>
                </View>
                <View style={styles.actionColumn}>
                    <Text style={styles.actionText}>{step.action}</Text>
                </View>
                </View>
            ))}
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 20,
        alignItems: 'center', // 전체 내용 중앙 정렬
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 800, // 웹에서 표가 너무 퍼지지 않게 제한
        paddingHorizontal: 20,
    },
    raceIndicator: { 
        width: 40, 
        height: 4, 
        borderRadius: 2, 
        marginBottom: 10 
    },
    detailTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: COLORS.text, 
        marginBottom: 25 
    },
    tableHeader: { 
        flexDirection: 'row', 
        paddingVertical: 12, 
        marginBottom: 10,
        alignItems: 'center',
    },
    tableHeaderText: { 
        fontWeight: 'bold', 
        fontSize: 14,
        textAlign: 'center',
    },
    tableRow: { 
        flexDirection: 'row', 
        borderBottomWidth: 1, 
        borderBottomColor: COLORS.border, 
        paddingVertical: 15, 
        alignItems: 'center',
    },
    // 열(Column) 정렬 설정
    popColumn: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    timeColumn: { 
        flex: 1.2, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    actionColumn: { 
        flex: 3, 
        paddingLeft: 15, // 글자가 시작되는 위치 확보
        justifyContent: 'center' 
    },
    popText: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    timeText: { 
        color: COLORS.subText, 
        fontSize: 15,
        fontWeight: '500'
    },
    actionText: { 
        color: COLORS.text, 
        fontSize: 16 
    },
});
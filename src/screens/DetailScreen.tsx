import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useBuilds } from '../context/BuildContext';
import { commonStyles } from '../utils/commonStyles';
import { COLORS, getRaceColor } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { item } = route.params;
  const { deleteBuild } = useBuilds();
  const themeColor = getRaceColor(item.race);

  const handleDelete = () => {
    const performDelete = () => {
      deleteBuild(item.id);
      navigation.goBack();
    };

    // 웹 브라우저 환경 대응
    if (Platform.OS === 'web') {
      if (window.confirm("이 빌드를 정말 삭제하시겠습니까?")) {
        performDelete();
      }
    } else {
      // 모바일 앱 환경 대응
      Alert.alert(
        "빌드 삭제",
        "정말로 이 빌드를 삭제하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          { text: "삭제", style: "destructive", onPress: performDelete }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          
          {/* 헤더 영역: 제목 및 버튼 그룹 */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={[styles.raceIndicator, { backgroundColor: themeColor }]} />
              <Text style={styles.detailTitle}>{item.title}</Text>
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddBuild', { item })}
              >
                <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>수정</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: '#ff4444', marginLeft: 8 }]}
                onPress={handleDelete}
              >
                <Text style={[styles.actionButtonText, { color: '#ff4444' }]}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 빌드 표 헤더 */}
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
    alignItems: 'center' 
  },
  contentWrapper: { 
    width: '100%', 
    maxWidth: 800, 
    paddingHorizontal: 20 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end',
    marginBottom: 25 
  },
  buttonGroup: {
    flexDirection: 'row',
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
    color: COLORS.text 
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  tableHeader: { 
    flexDirection: 'row', 
    paddingVertical: 12, 
    marginBottom: 10, 
    alignItems: 'center' 
  },
  tableHeaderText: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    textAlign: 'center' 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border, 
    paddingVertical: 15, 
    alignItems: 'center' 
  },
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
    paddingLeft: 15, 
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
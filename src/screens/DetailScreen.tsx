import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useBuilds } from '../context/BuildContext';
import { commonStyles } from '../utils/commonStyles';
import { COLORS, getRaceColor } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { item } = route.params;
  const { deleteBuild, loadingBuilds } = useBuilds(); // loadingBuilds 상태 추가
  const themeColor = getRaceColor(item.race);

  const handleDelete = () => {
    const performDelete = () => {
      deleteBuild(item.id);
      navigation.goBack();
    };

    if (Platform.OS === 'web') {
      if (window.confirm("이 빌드를 정말 삭제하시겠습니까?")) {
        performDelete();
      }
    } else {
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

  if (loadingBuilds) { // 빌드 로딩 중일 때 표시
    return (
    <SafeAreaView style={commonStyles.safeArea}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>

          {/* 헤더 영역: 제목 및 버튼 그룹 */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={[styles.raceIndicator, { backgroundColor: themeColor }]} />
              <Text style={styles.detailTitle}>{item.title}</Text>
              {item.description && <Text style={styles.descriptionText}>{item.description}</Text>} {/* 설명 추가 */}
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddBuild', { item })}
              >
                <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>수정</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { borderColor: COLORS.secondary, marginLeft: 8 }]} // secondary 사용
                onPress={handleDelete}
              >
                <Text style={[styles.actionButtonText, { color: COLORS.secondary }]}>삭제</Text>
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
          {item.build_steps?.map((step, index) => (
            <View key={step.id ?? index} style={styles.tableRow}> {/* key에 id 사용, 없으면 index */}
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
  descriptionText: { // 설명 텍스트 스타일 추가
    fontSize: 14, 
    color: COLORS.subText, 
    marginTop: 5,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
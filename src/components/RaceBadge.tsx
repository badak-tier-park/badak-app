import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, getRaceColor } from '../utils/theme'; // getRaceColor 함수가 theme.ts에 있다고 가정

interface RaceBadgeProps {
  race: 'T' | 'Z' | 'P';
}

export const RaceBadge: React.FC<RaceBadgeProps> = ({ race }) => {
  const raceText = race === 'T' ? '테란' : race === 'Z' ? '저그' : '프로토스';
  const backgroundColor = getRaceColor(race); // 종족별 색상 가져오기

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.badgeText}>{raceText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // 다른 요소와의 간격
  },
  badgeText: {
    color: '#fff', // 흰색 텍스트
    fontSize: 12,
    fontWeight: 'bold',
  },
});
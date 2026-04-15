import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, getRaceColor } from '../utils/theme';

interface RaceBadgeProps {
  race: 'T' | 'Z' | 'P';
}

export const RaceBadge: React.FC<RaceBadgeProps> = ({ race }) => {
  const raceText = race === 'T' ? '테란' : race === 'Z' ? '저그' : '프로토스';
  const backgroundColor = getRaceColor(race);

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
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
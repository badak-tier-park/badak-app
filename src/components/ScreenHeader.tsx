// components/ScreenHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

interface ScreenHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, rightComponent }) => {
  return (
    <View style={styles.headerArea}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerArea: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
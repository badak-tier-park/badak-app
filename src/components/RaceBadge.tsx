import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRaceColor } from '../utils/theme';

interface Props {
    race: 'T' | 'Z' | 'P';
}

export const RaceBadge = ({ race }: Props) => (
    <View style={[styles.badge, { backgroundColor: getRaceColor(race) }]}>
        <Text style={styles.text}>{race}</Text>
    </View>
);

const styles = StyleSheet.create({
    badge: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const { item } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.detailTitle}>{item.title}</Text>
        
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>인구수</Text>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>할 일</Text>
        </View>

        {item.buildSteps.map((step, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.popColumn}>
              <Text style={styles.popText}>{step.pop}</Text>
            </View>
            <View style={styles.actionColumn}>
              <Text style={styles.actionText}>{step.action}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  detailTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#333', padding: 12, borderRadius: 8, marginBottom: 5 },
  tableHeaderText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#222', paddingVertical: 12, alignItems: 'center' },
  popColumn: { flex: 1, alignItems: 'center' },
  popText: { color: '#007AFF', fontSize: 18, fontWeight: 'bold' },
  actionColumn: { flex: 3, paddingLeft: 20 },
  actionText: { color: '#eee', fontSize: 16 },
});
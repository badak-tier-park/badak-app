import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, BuildItem } from '../types';
import { BUILD_DATA } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<string>('All');
  const filteredData = filter === 'All' ? BUILD_DATA : BUILD_DATA.filter(item => item.race === filter);

  const getRaceBadgeStyle = (race: string) => {
    if (race === 'T') return { backgroundColor: '#3498db' };
    if (race === 'Z') return { backgroundColor: '#9b59b6' };
    return { backgroundColor: '#f1c40f' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {['All', 'T', 'Z', 'P'].map((r) => (
          <TouchableOpacity 
            key={r} 
            style={[styles.filterButton, filter === r && styles.filterActive]} 
            onPress={() => setFilter(r)}
          >
            <Text style={[styles.filterText, filter === r && styles.filterTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { item })}>
            <View style={styles.cardHeader}>
              <Text style={[styles.raceBadge, getRaceBadgeStyle(item.race)]}>{item.race}</Text>
              <Text style={styles.matchupText}>{item.matchup}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center' },
  filterContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#333', marginHorizontal: 5 },
  filterActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#bbb', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  listContent: { paddingHorizontal: 20 , width: '100%', maxWidth: 600},
  card: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  raceBadge: { width: 24, height: 24, borderRadius: 12, textAlign: 'center', lineHeight: 24, color: '#fff', fontWeight: 'bold', marginRight: 10, fontSize: 12, overflow: 'hidden' },
  matchupText: { color: '#fff', fontWeight: 'bold' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
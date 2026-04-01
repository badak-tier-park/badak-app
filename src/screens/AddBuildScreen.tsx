import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, BuildStep } from '../types';
import { useBuilds } from '../context/BuildContext';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddBuild'>;

export default function AddBuildScreen({ navigation, route }: Props) {
  const { addBuild, updateBuild } = useBuilds();
  
  // 수정 모드인지 확인 (데이터가 넘어왔으면 수정 모드)
  const editItem = route.params?.item;
  const isEdit = !!editItem;

  const [title, setTitle] = useState(editItem?.title || '');
  const [race, setRace] = useState<'T' | 'Z' | 'P'>(editItem?.race || 'T');
  const [steps, setSteps] = useState<BuildStep[]>(
    editItem?.buildSteps || [{ pop: 0, time: '00:00', action: '' }]
  );

  const addStep = () => {
    setSteps([...steps, { pop: 0, time: '00:00', action: '' }]);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const buildData = {
      id: isEdit ? editItem.id : Date.now().toString(),
      title,
      race,
      matchup: editItem?.matchup || 'TvX',
      difficulty: editItem?.difficulty || 'Normal',
      tags: editItem?.tags || [],
      buildSteps: steps,
    };

    if (isEdit) {
      updateBuild(buildData);
    } else {
      addBuild(buildData);
    }
    
    navigation.goBack();
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>빌드 제목</Text>
          <TextInput 
            style={styles.input} 
            value={title}
            onChangeText={setTitle}
            placeholder="빌드 이름을 입력하세요"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>종족</Text>
          <View style={styles.raceRow}>
            {(['T', 'Z', 'P'] as const).map((r) => (
              <TouchableOpacity 
                key={r} 
                style={[styles.raceButton, race === r && { borderColor: COLORS.primary, borderWidth: 2 }]}
                onPress={() => setRace(r)}
              >
                <Text style={{ color: '#fff' }}>{r === 'T' ? '테란' : r === 'Z' ? '저그' : '토스'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.label}>빌드 단계</Text>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <TextInput 
              style={[styles.input, { flex: 1, marginRight: 5 }]} 
              placeholder="인구" 
              keyboardType="numeric"
              value={step.pop.toString()}
              onChangeText={(val) => {
                const newSteps = [...steps];
                newSteps[index].pop = parseInt(val) || 0;
                setSteps(newSteps);
              }}
            />
            <TextInput 
              style={[styles.input, { flex: 1.5, marginRight: 5 }]} 
              placeholder="시간" 
              value={step.time}
              onChangeText={(val) => {
                const newSteps = [...steps];
                newSteps[index].time = val;
                setSteps(newSteps);
              }}
            />
            <TextInput 
              style={[styles.input, { flex: 3 }]} 
              placeholder="할 일" 
              value={step.action}
              onChangeText={(val) => {
                const newSteps = [...steps];
                newSteps[index].action = val;
                setSteps(newSteps);
              }}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addStep}>
          <Text style={{ color: COLORS.primary }}>+ 단계 추가</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{isEdit ? '수정 완료' : '저장하기'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 20 },
  label: { color: COLORS.subText, marginBottom: 8, fontSize: 14, fontWeight: 'bold' },
  input: { 
    backgroundColor: COLORS.surface, 
    color: '#fff', 
    padding: 12, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  raceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  raceButton: { 
    flex: 1, 
    backgroundColor: COLORS.surface, 
    padding: 10, 
    marginHorizontal: 5, 
    alignItems: 'center', 
    borderRadius: 8 
  },
  stepRow: { flexDirection: 'row', marginBottom: 10 },
  addButton: { padding: 15, alignItems: 'center' },
  saveButton: { 
    backgroundColor: COLORS.primary, 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 20 
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
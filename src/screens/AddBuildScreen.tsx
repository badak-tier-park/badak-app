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
  
  const editItem = route.params?.item;
  const isEdit = !!editItem;

  const [title, setTitle] = useState(editItem?.title || '');
  const [race, setRace] = useState<'T' | 'Z' | 'P'>(editItem?.race || 'T');
  const [description, setDescription] = useState(editItem?.description || ''); 
  
  const initialSteps: BuildStep[] = editItem?.build_steps?.map((step, index) => ({
      ...step,
      pop: step.pop?.toString() || '0', 
      time: step.time || '00:00',
      action: step.action || '',
      step_order: step.step_order ?? index, 
  })) || [ 
      { pop: '0', time: '00:00', action: '', step_order: 0 } 
  ];
  
  const [steps, setSteps] = useState<BuildStep[]>(initialSteps);

  const addStep = () => {
    setSteps([...steps, { pop: '0', time: '00:00', action: '', step_order: steps.length }]);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    const currentSteps = steps; 

    const buildData = {
      title,
      race,
      description,
    };

    if (isEdit) {
      updateBuild(editItem.id, buildData, currentSteps); 
    } else {
      addBuild(buildData, currentSteps);
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

        <View style={styles.inputGroup}>
            <Text style={styles.label}>빌드 설명</Text>
            <TextInput 
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                value={description ?? ''} 
                onChangeText={setDescription}
                placeholder="이 빌드에 대한 설명을 입력하세요."
                placeholderTextColor="#666"
                multiline
            />
        </View>

        <Text style={styles.label}>빌드 단계</Text>
        {/* 새롭게 추가된 레이블 */}
        <View style={styles.stepLabelsRow}>
          <Text style={[styles.stepLabelText, { width: 60 }]}>인구</Text>
          <Text style={[styles.stepLabelText, { width: 80 }]}>시간</Text>
          <Text style={[styles.stepLabelText, { flex: 1 }]}>할 일</Text>
        </View>

        {steps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <TextInput
              style={[styles.input, { width: 60, marginRight: 5 }]} 
              placeholder="인구"
              keyboardType="numeric"
              value={step.pop} 
              onChangeText={(val) => {
                const newSteps = [...steps];
                newSteps[index].pop = val; 
                setSteps(newSteps);
              }}
            />
            <TextInput
              style={[styles.input, { width: 80, marginRight: 5 }]} 
              placeholder="시간 (e.g., 03:30)"
              value={step.time}
              onChangeText={(val) => {
                const newSteps = [...steps];
                newSteps[index].time = val;
                setSteps(newSteps);
              }}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]} 
              placeholder="건설, 생산 등"
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
  stepLabelsRow: { // 추가된 스타일
    flexDirection: 'row',
    marginBottom: 5,
    paddingHorizontal: 5, // Input 필드의 padding과 맞추기
  },
  stepLabelText: { // 추가된 스타일
    color: COLORS.subText,
    fontSize: 12,
    marginRight: 5, // TextInput과 동일한 간격
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
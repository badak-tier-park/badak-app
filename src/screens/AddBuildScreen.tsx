import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { commonStyles } from '../utils/commonStyles';
import { COLORS } from '../utils/theme';

export default function AddBuildScreen({ navigation }: any) {
    const [title, setTitle] = useState('');
    const [race, setRace] = useState<'T' | 'Z' | 'P'>('T');
    const [steps, setSteps] = useState([{ pop: 0, time: '00:00', action: '' }]);

    const handleSave = () => {
        console.log({ title, race, steps });
        navigation.goBack();
    };

    const addStep = () => {
        setSteps([...steps, { pop: 0, time: '00:00', action: '' }]);
    };

    return (
        <SafeAreaView style={commonStyles.safeArea}>
        <ScrollView contentContainerStyle={commonStyles.container}>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>빌드 제목</Text>
            <TextInput 
                style={styles.input} 
                placeholder="예: 111 정석 운영" 
                placeholderTextColor="#666"
                value={title}
                onChangeText={setTitle}
            />
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>종족 선택</Text>
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

            <Text style={styles.label}>빌드 순서</Text>
            {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
                <TextInput 
                style={[styles.input, { flex: 1, marginRight: 5 }]} 
                placeholder="인구" 
                keyboardType="numeric"
                onChangeText={(val) => {
                    const newSteps = [...steps];
                    newSteps[index].pop = parseInt(val) || 0;
                    setSteps(newSteps);
                }}
                />
                <TextInput 
                style={[styles.input, { flex: 1.5, marginRight: 5 }]} 
                placeholder="시간" 
                onChangeText={(val) => {
                    const newSteps = [...steps];
                    newSteps[index].time = val;
                    setSteps(newSteps);
                }}
                />
                <TextInput 
                style={[styles.input, { flex: 3 }]} 
                placeholder="할 일" 
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
            <Text style={styles.saveButtonText}>저장하기</Text>
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
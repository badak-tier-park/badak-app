import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';
import { commonStyles } from '../utils/commonStyles';

export default function LoginScreen() {
  const { signInWithDiscord } = useAuth();

  return (
    <SafeAreaView style={[commonStyles.safeArea, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.logo}>BADAK</Text>
        <Text style={styles.subtitle}>등록된 사용자만 이용 가능한 서비스입니다.</Text>
        
        <TouchableOpacity style={styles.loginButton} onPress={signInWithDiscord}>
          <Text style={styles.buttonText}>디스코드 로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  content: { width: '80%', alignItems: 'center' },
  logo: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  subtitle: { color: COLORS.subText, marginBottom: 40, textAlign: 'center' },
  loginButton: { 
    backgroundColor: '#5865F2', // 디스코드 브랜드 컬러
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 8, 
    width: '100%',
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
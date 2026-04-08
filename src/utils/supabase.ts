import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants'; // 이 부분이 import 되어 있어야 합니다.

// --- DEBUGGING: Constants.expoConfig.extra 값 확인 ---
console.log('--- supabase.ts DEBUG ---');
console.log('Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
console.log('Constants.expoConfig?.extra?.supabaseUrl (from app.config.ts):', Constants.expoConfig?.extra?.supabaseUrl);
console.log('Constants.expoConfig?.extra?.supabaseAnonKey (from app.config.ts):', Constants.expoConfig?.extra?.supabaseAnonKey);
console.log('---------------------------');
// ---------------------------------------------------

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase 설정값이 비어있습니다. app.config.ts의 extra 필드를 확인해주세요!');
    throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);
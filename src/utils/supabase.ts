import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants'; 

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
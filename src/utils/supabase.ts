import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase 설정값이 비어있습니다. .env 파일을 확인해주세요!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
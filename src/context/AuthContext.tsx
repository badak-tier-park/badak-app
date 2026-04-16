import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithDiscord: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 세션 초기화 및 변경 감지
        supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        
        if (session?.user) {
            const discordId = session.user.user_metadata.provider_id || 
                            session.user.identities?.[0]?.identity_data?.sub;
            
            const extendedUser = {
            ...session.user,
            discord_custom_id: discordId ? Number(discordId) : null
            };
            setUser(extendedUser as any);
        } else {
            setUser(null);
        }
        setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithDiscord = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: window.location.origin, // 웹 기준, 모바일은 deep link 설정 필요
        }
        });
        if (error) console.error('Discord 로그인 에러:', error.message);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signInWithDiscord, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
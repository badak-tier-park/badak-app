import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types';
import { supabase } from '../utils/supabase';

interface UserContextType {
    users: User[];
    loadingUsers: boolean;
    fetchUsers: () => Promise<void>;
    filterUsers: (tier?: string | null, race?: 'T' | 'Z' | 'P' | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [currentFilter, setCurrentFilter] = useState<{ tier?: string | null; race?: 'T' | 'Z' | 'P' | null }>({});

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        let query = supabase.from('users').select('*').order('created_at', { ascending: false });

        if (currentFilter.tier) {
            query = query.eq('tier', currentFilter.tier);
        }
        if (currentFilter.race) {
            query = query.eq('race', currentFilter.race);
        }

        const { data, error } = await query;

        if (error) {
            console.error('유저 데이터 로딩 에러:', error.message);
        } else {
            const formattedData: User[] = data?.map((user: any) => ({
                id: user.id,
                discord_id: user.discord_id?.toString() || null,
                nickname: user.nickname,
                race: user.race,
                tier: user.tier,
                is_admin: user.is_admin,
                created_at: user.created_at,
                updated_at: user.updated_at,
            })) || [];
            setUsers(formattedData);
        }
        setLoadingUsers(false);
    }, [currentFilter]);
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    const filterUsers = (tier?: string | null, race?: 'T' | 'Z' | 'P' | null) => {
        setCurrentFilter({ tier, race });
    };

    return (
        <UserContext.Provider value={{ users, loadingUsers, fetchUsers, filterUsers }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUsers must be used within a UserProvider');
    return context;
};
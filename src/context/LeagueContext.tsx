import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { League, User, MapInfo } from '../types';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

interface LeagueContextType {
    leagues: League[];
    loadingLeagues: boolean;
    fetchLeagues: () => Promise<void>;
    fetchLeagueById: (id: string) => Promise<League | null>;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [allMaps, setAllMaps] = useState<MapInfo[]>([]); // 맵 데이터 캐싱용
    const [loadingLeagues, setLoadingLeagues] = useState(true);
    const { user } = useAuth();

    // 모든 맵 정보 가져오기
    const fetchAllMaps = useCallback(async () => {
        const { data, error } = await supabase.from('maps').select('id, name, image_url');
        if (!error && data) {
            setAllMaps(data as MapInfo[]);
        }
    }, []);

    const formatUser = (u: any): User => ({
        id: u.id,
        discord_id: u.discord_id?.toString() || null,
        nickname: u.nickname || null,
        race: u.race || null,
        tier: u.tier || null,
        is_admin: u.is_admin || false,
        created_at: u.created_at || '',
        updated_at: u.updated_at || '',
    });

    // 맵 ID와 캐싱된 맵 정보를 매칭하는 함수
    const formatLeagueData = useCallback((data: any[]): League[] => {
        return data.map((league: any) => ({
            ...league,
            league_captains: league.league_captains?.map((c: any) => ({
                ...c,
                player: c.player ? formatUser(c.player) : undefined,
            })) || [],
            league_match_maps: league.league_match_maps?.map((m: any) => {
                // map_ids가 문자열인 경우 배열로 변환
                const idList = typeof m.map_ids === 'string' 
                    ? m.map_ids.split(',').map((id: string) => id.trim()) 
                    : Array.isArray(m.map_ids) ? m.map_ids : [];
                
                // 캐싱된 allMaps에서 이름 찾기
                const matchedMaps = allMaps.filter(map => idList.includes(map.id));
                
                return {
                    ...m,
                    map_ids: idList,
                    maps: matchedMaps // 상세 정보 포함
                };
            }) || [],
            league_draft_picks: league.league_draft_picks?.map((p: any) => ({
                ...p,
                captain_player: p.captain_player ? formatUser(p.captain_player) : undefined,
                member_player: p.member_player ? formatUser(p.member_player) : undefined,
            })) || [],
            league_seed_holders: league.league_seed_holders?.map((h: any) => ({
                ...h,
                player: h.player ? formatUser(h.player) : undefined,
            })) || [],
        }));
    }, [allMaps]);

    const fetchLeagues = useCallback(async () => {
        setLoadingLeagues(true);
        try {
            const { data, error } = await supabase
                .from('leagues')
                .select(`
                    *,
                    league_captains (*, player:users (*)),
                    league_match_maps (*),
                    league_seed_holders (*, player:users (*))
                `)
                .order('start_date', { ascending: false });

            if (error) throw error;
            if (data) setLeagues(formatLeagueData(data));
        } catch (error: any) {
            console.error('리그 로딩 에러:', error.message);
        } finally {
            setLoadingLeagues(false);
        }
    }, [formatLeagueData]);

    const fetchLeagueById = useCallback(async (id: string): Promise<League | null> => {
        const { data, error } = await supabase
            .from('leagues')
            .select(`
                *,
                league_captains (*, player:users (*)),
                league_match_maps (*),
                league_draft_picks (*),
                league_seed_holders (*, player:users (*))
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return formatLeagueData([data])[0];
    }, [formatLeagueData]);

    useEffect(() => {
        const init = async () => {
            await fetchAllMaps();
            await fetchLeagues();
        };
        init();
    }, [fetchAllMaps, fetchLeagues]);

    return (
        <LeagueContext.Provider value={{ leagues, loadingLeagues, fetchLeagues, fetchLeagueById }}>
            {children}
        </LeagueContext.Provider>
    );
};

export const useLeagues = () => {
    const context = useContext(LeagueContext);
    if (!context) throw new Error('useLeagues must be used within a LeagueProvider');
    return context;
};
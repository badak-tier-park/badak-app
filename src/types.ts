export interface BuildStep {
    id?: number;
    build_id?: string;
    step_order: number;
    pop: string; 
    time: string;
    action: string;
    note?: string;
}

export interface BuildItem {
    id: string;
    title: string;
    race: 'T' | 'Z' | 'P';
    description: string | null; 
    author_id: number | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    build_steps: BuildStep[]; 
}

export interface User {
    id: number;
    discord_id: string | null;
    nickname: string | null;
    race: 'T' | 'Z' | 'P' | null;
    tier: string | null;
    is_admin: boolean | null;
    created_at: string;
    updated_at: string;
}

// 리그 관련 추가
export interface League {
    id: string;
    type: 'regular_summer' | 'regular_winter' | 'jongchoe' | 'individual' | string;
    name: string;
    start_date: string;
    end_date: string;
    eligible_tiers: string[]; // _text 배열이지만 string[]으로 처리
    created_at: string;
    updated_at: string;
    eligibility_type: 'open' | 'application' | 'invitation' | string;
    description: string | null;
    has_draft: boolean;
    draft_date: string | null;
    captain_count: number;
    is_ready: boolean;
    draft_completed: boolean;
    picks_completed: boolean;
    
    league_captains?: LeagueCaptain[];
    league_match_maps?: LeagueMatchMap[];
    league_draft_picks?: LeagueDraftPick[];
    league_seed_holders?: LeagueSeedHolder[];
    league_match_slot_results?: LeagueMatchSlotResult[];
}

export interface LeagueCaptain {
    id: string;
    league_id: string;
    player_id: number;
    order_num: number;
    created_at: string;
    player?: User;
}

export interface MapInfo {
    id: string;
    name: string;
    image_url: string | null;
}

export interface LeagueMatchMap {
    id: string;
    league_id: string;
    match_number: number;
    map_ids: string[];
    updated_at: string;
    maps?: MapInfo[];
}

export interface LeagueDraftPick {
    id: number;
    league_id: string;
    captain_player_id: number;
    member_player_id: number;
    pick_order: number;
    created_at: string;
    captain_player?: User;
    member_player?: User;
}

export interface LeagueSeedHolder {
    id: number;
    league_id: string;
    player_id: number;
    order_num: number;
    created_at: string;
    player?: User;
}

export interface LeagueMatchSlotResult {
    schedule_id: number;
    slot_num: number;
    winner_captain_id: number | null;
    selected_map_id: string | null;
}

export interface LeagueMatchEntry {
    id: number;
    schedule_id: number;
    captain_player_id: number;
    match_slot: number;
    player_ids: number[];
    captain?: {
        nickname: string;
    };
}

export type RootStackParamList = {
    Home: undefined;
    Detail: { item: BuildItem };
    AddBuild: { item?: BuildItem };
    UserList: undefined;
    Builds: undefined;
    Users: undefined;
    Leagues: undefined;
    LeagueSchedule: { league: any };
    LeagueDetail: { league: any, schedule: any };
};
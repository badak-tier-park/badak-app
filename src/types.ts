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

export type RootStackParamList = {
    Home: undefined;
    Detail: { item: BuildItem };
    AddBuild: { item?: BuildItem };
    UserList: undefined;
    Builds: undefined;
    Users: undefined;
};
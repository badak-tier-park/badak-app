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

// User 인터페이스 추가 (DB users 테이블 구조 참고)
export interface User {
    id: number; // bigint로 되어있지만 JS/TS에서는 number로 충분
    discord_id: string | null; // bigint지만 string으로 처리
    nickname: string | null;
    race: 'T' | 'Z' | 'P' | null;
    tier: string | null; // 티어는 text 타입
    is_admin: boolean | null;
    created_at: string;
    updated_at: string;
}

export type RootStackParamList = {
    Home: undefined;
    Detail: { item: BuildItem };
    AddBuild: { item?: BuildItem };
    UserList: undefined; // 유저 목록 화면 추가
    // 탭 네비게이터의 Root도 여기에 포함될 수 있지만, Tab.Navigator 자체에서 정의하는 것이 더 일반적
    Builds: undefined; // Tab Navigator의 Build Stack
    Users: undefined; // Tab Navigator의 User List
};
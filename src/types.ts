export interface BuildStep {
    id?: number;
    build_id?: string;
    step_order: number; // 필수 속성이므로 기본값 설정이 필요할 수 있음
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
    // build_steps는 BuildStep 배열이어야 함
    build_steps: BuildStep[]; 
}

export type RootStackParamList = {
    Home: undefined;
    Detail: { item: BuildItem };
    AddBuild: { item?: BuildItem };
};
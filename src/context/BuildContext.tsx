import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { BuildItem, BuildStep } from '../types'; 
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';
import { useUsers } from './UserContext';

interface BuildContextType {
    builds: BuildItem[];
    loadingBuilds: boolean; 
    addBuild: (buildData: Partial<BuildItem>, steps: BuildStep[]) => void; 
    updateBuild: (buildId: string, buildData: Partial<BuildItem>, steps: BuildStep[]) => void;
    deleteBuild: (id: string) => void;
    fetchBuilds: () => Promise<void>; 
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export const BuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [builds, setBuilds] = useState<BuildItem[]>([]); 
    const [loadingBuilds, setLoadingBuilds] = useState(true); 
    const { user } = useAuth(); // Supabase Auth User (ID는 UUID)

    const fetchBuilds = useCallback(async () => {
        setLoadingBuilds(true);
        // RLS 정책이 auth.role() = 'authenticated' 이면, 모든 authenticated 사용자의 빌드를 가져옴
        const { data, error } = await supabase
            .from('builds')
            .select(`
                *, 
                build_steps ( * ) 
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('빌드 데이터 로딩 에러:', error.message);
        } else {
            const formattedData = data?.map((build: any) => ({
                id: build.id,
                title: build.title,
                race: build.race,
                description: build.description,
                author_id: build.author_id, // author_id는 bigint 또는 uuid (DB 설정에 따라)
                is_public: build.is_public,
                created_at: build.created_at,
                updated_at: build.updated_at,
                build_steps: build.build_steps?.map((step: any) => ({
                    id: step.id,
                    build_id: step.build_id,
                    step_order: step.step_order ?? 0,
                    pop: step.pop?.toString() || '0', 
                    time: step.time || '00:00',
                    action: step.action || '',
                    note: step.note,
                })) || [], 
            })) || [];
            setBuilds(formattedData);
        }
        setLoadingBuilds(false);
    }, []);

    useEffect(() => {
        fetchBuilds();
    }, [fetchBuilds]);

    const addBuild = async (buildData: Partial<BuildItem>, steps: BuildStep[]) => { 
        // author_id를 null로 보내고, RLS 정책은 authenticated 사용자만 허용하도록 설정
        const authorId = null; 
        console.log('Saving build with author_id (temporarily null):', authorId);

        const { data: newBuild, error: buildError } = await supabase
            .from('builds')
            .insert([{
                title: buildData.title,
                race: buildData.race,
                description: buildData.description,
                author_id: authorId // null 전달
            }])
            .select() // 생성된 빌드의 id 등을 받아오기 위해 select 사용
            .single();

        if (buildError) {
            console.error('빌드 저장 실패:', buildError); 
            return;
        }
        
        // newBuild.id 는 Supabase에서 생성된 빌드의 UUID (또는 ID)
        const newBuildId = newBuild?.id; 
        if (!newBuildId) {
             console.error('새 빌드 ID를 가져오지 못했습니다.');
             return;
        }

        const stepsToInsert = steps.map((step, index) => ({
            build_id: newBuildId, // 생성된 빌드의 ID 사용
            step_order: index, 
            pop: step.pop, 
            time: step.time,
            action: step.action
        }));

        const { error: stepError } = await supabase
            .from('build_steps')
            .insert(stepsToInsert);

        if (stepError) {
             console.error('단계 저장 실패:', stepError); 
        } else {
             fetchBuilds(); // 성공 시 데이터 새로고침
        }
    };

    const updateBuild = async (buildId: string, buildData: Partial<BuildItem>, steps: BuildStep[]) => {
        // Update 시 author_id는 변경하지 않거나, 필요하다면 로그인된 사용자의 ID로 업데이트
        
        const { error: buildError } = await supabase
            .from('builds')
            .update({
                title: buildData.title,
                race: buildData.race,
                description: buildData.description,
                updated_at: new Date().toISOString()
            })
            .eq('id', buildId);

        if (buildError) return console.error('빌드 업데이트 실패:', buildError);

        await supabase.from('build_steps').delete().eq('build_id', buildId);
        
        const stepsToInsert = steps.map((step, index) => ({
            build_id: buildId,
            step_order: index, 
            pop: step.pop, 
            time: step.time,
            action: step.action
        }));

        const { error: stepError } = await supabase.from('build_steps').insert(stepsToInsert);
        if (stepError) console.error('단계 업데이트 실패:', stepError);
        
        fetchBuilds();
    };

    const deleteBuild = async (id: string) => {
        const { error } = await supabase.from('builds').delete().eq('id', id);
        if (error) {
            console.error('빌드 삭제 실패:', error);
        } else {
            fetchBuilds();
        }
    };

    return (
        <BuildContext.Provider value={{ builds, loadingBuilds, addBuild, updateBuild, deleteBuild, fetchBuilds }}>
        {children}
        </BuildContext.Provider>
    );
};

export const useBuilds = () => {
    const context = useContext(BuildContext);
    if (!context) throw new Error('useBuilds must be used within a BuildProvider');
    return context;
};
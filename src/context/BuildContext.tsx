import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { BuildItem, BuildStep } from '../types'; 
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

interface BuildContextType {
    builds: BuildItem[];
    loadingBuilds: boolean; 
    addBuild: (buildData: Partial<BuildItem>, steps: BuildStep[]) => Promise<void>; 
    updateBuild: (buildId: string, buildData: Partial<BuildItem>, steps: BuildStep[]) => Promise<void>;
    deleteBuild: (id: string) => Promise<void>;
    fetchBuilds: () => Promise<void>; 
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export const BuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [builds, setBuilds] = useState<BuildItem[]>([]); 
    const [loadingBuilds, setLoadingBuilds] = useState(true); 
    const { user } = useAuth();

    const fetchBuilds = useCallback(async () => {
        setLoadingBuilds(true);
        try {
            const { data, error } = await supabase
                .from('builds')
                .select(`
                    *,
                    build_steps ( * ) 
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedData = data?.map((build: any) => ({
                id: build.id,
                title: build.title,
                race: build.race,
                description: build.description,
                author_id: build.author_id,
                is_public: build.is_public,
                created_at: build.created_at,
                updated_at: build.updated_at,
                build_steps: build.build_steps?.sort((a: any, b: any) => a.step_order - b.step_order).map((step: any) => ({
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
        } catch (error: any) {
            console.error('빌드 데이터 로딩 에러:', error.message);
        } finally {
            setLoadingBuilds(false);
        }
    }, []);

    useEffect(() => {
        fetchBuilds();
    }, [fetchBuilds]);

    const addBuild = async (buildData: Partial<BuildItem>, steps: BuildStep[]) => {
        const discordId = (user as any)?.discord_custom_id;
        if (!discordId) {
            alert('인증 정보가 없습니다. 다시 로그인해주세요.');
            return;
        }

        const { data: newBuild, error: buildError } = await supabase
            .from('builds')
            .insert([{
                title: buildData.title || "새 빌드",
                race: buildData.race || "T",
                description: buildData.description || "",
                author_id: String(discordId) 
            }])
            .select()
            .single();

        if (buildError) {
            console.error('빌드 저장 실패:', buildError);
            return;
        }

        if (newBuild && steps.length > 0) {
            const stepsToInsert = steps.map((step, index) => ({
                build_id: newBuild.id,
                step_order: index,
                pop: step.pop,
                time: step.time,
                action: step.action
            }));

            const { error: stepError } = await supabase.from('build_steps').insert(stepsToInsert);
            if (stepError) console.error('단계 저장 실패:', stepError);
        }
        
        await fetchBuilds();
    };

    const updateBuild = async (buildId: string, buildData: Partial<BuildItem>, steps: BuildStep[]) => {
        const discordId = String((user as any)?.discord_custom_id);

        // 1. 빌드 기본 정보 업데이트 (본인 글일 때만 업데이트되도록 author_id 조건 추가)
        const { error: buildError } = await supabase
            .from('builds')
            .update({
                title: buildData.title,
                race: buildData.race,
                description: buildData.description,
                updated_at: new Date().toISOString()
            })
            .eq('id', buildId)
            .eq('author_id', discordId); // 보안 강화: 작성자 본인 확인

        if (buildError) {
            console.error('빌드 업데이트 실패:', buildError);
            alert('수정 권한이 없거나 오류가 발생했습니다.');
            return;
        }

        // 2. 기존 단계 삭제 후 재삽입 (트랜잭션 처리가 안되므로 순차 진행)
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

        await fetchBuilds();
    };

    // 빌드 삭제 (본인 확인 로직 포함)
    const deleteBuild = async (id: string) => {
        const discordId = String((user as any)?.discord_custom_id);

        const { error } = await supabase
            .from('builds')
            .delete()
            .eq('id', id)
            .eq('author_id', discordId); // 보안 강화: 작성자 본인 확인

        if (error) {
            console.error('빌드 삭제 실패:', error);
            alert('삭제 권한이 없거나 이미 삭제된 게시물입니다.');
        } else {
            await fetchBuilds();
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
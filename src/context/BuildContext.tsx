import React, { createContext, useState, useContext, useEffect } from 'react';
import { BuildItem, BuildStep } from '../types'; 
import { supabase } from '../utils/supabase';

interface BuildContextType {
    builds: BuildItem[];
    addBuild: (buildData: Partial<BuildItem>, steps: BuildStep[]) => void; 
    updateBuild: (buildId: string, buildData: Partial<BuildItem>, steps: BuildStep[]) => void;
    deleteBuild: (id: string) => void;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export const BuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [builds, setBuilds] = useState<BuildItem[]>([]); 
    const [loading, setLoading] = useState(true);

    const fetchBuilds = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('builds')
            .select(`
                *, 
                build_steps ( * ) 
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('데이터 로딩 에러:', error.message);
        } else {
            const formattedData = data?.map((build: any) => ({
                ...build,
                build_steps: build.build_steps?.map((step: any) => ({ // any 대신 BuildStep 타입으로 명시하면 더 좋음
                    id: step.id,
                    build_id: step.build_id,
                    step_order: step.step_order ?? 0, // step_order 기본값 설정
                    pop: step.pop?.toString() || '0', 
                    time: step.time || '00:00',
                    action: step.action || '',
                    note: step.note,
                })) || [], 
            })) || [];
            setBuilds(formattedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBuilds();
    }, []);

    const addBuild = async (buildData: Partial<BuildItem>, steps: BuildStep[]) => { 
        const { data: newBuild, error: buildError } = await supabase
            .from('builds')
            .insert([{
                title: buildData.title,
                race: buildData.race,
                description: buildData.description,
                author_id: 1 
            }])
            .select()
            .single();

        if (buildError) {
            console.error('빌드 저장 실패:', buildError);
            return;
        }

        const stepsToInsert = steps.map((step, index) => ({
            build_id: newBuild.id,
            step_order: index, // step_order를 index로 설정
            pop: step.pop, 
            time: step.time,
            action: step.action
        }));

        const { error: stepError } = await supabase
            .from('build_steps')
            .insert(stepsToInsert);

        if (stepError) console.error('단계 저장 실패:', stepError);
        fetchBuilds(); 
    };

    const updateBuild = async (buildId: string, buildData: Partial<BuildItem>, steps: BuildStep[]) => {
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
            step_order: index, // step_order를 index로 설정
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
        <BuildContext.Provider value={{ builds, addBuild, updateBuild, deleteBuild }}>
        {children}
        </BuildContext.Provider>
    );
};

export const useBuilds = () => {
    const context = useContext(BuildContext);
    if (!context) throw new Error('useBuilds must be used within a BuildProvider');
    return context;
};
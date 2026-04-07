import React, { createContext, useState, useContext, useEffect } from 'react';
import { BuildItem } from '../types';
import { BUILD_DATA as INITIAL_DATA } from '../services/dataService';
import { supabase } from '../utils/supabase';

interface BuildContextType {
    builds: BuildItem[];
    addBuild: (newBuild: BuildItem) => void;
    updateBuild: (updatedBuild: BuildItem) => void;
    deleteBuild: (id: string) => void;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export const BuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [builds, setBuilds] = useState<BuildItem[]>(INITIAL_DATA);
    const [loading, setLoading] = useState(true);

    const fetchBuilds = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('builds')
            .select(`
                *,
                build_steps (*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('데이터 로딩 에러:', error.message);
        } else {
            setBuilds(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBuilds();
    }, []);

    const addBuild = async (newBuild: BuildItem) => {
        // 1. 메인 빌드 정보 저장
        const { data: buildData, error: buildError } = await supabase
            .from('builds')
            .insert([{
                title: newBuild.title,
                race: newBuild.race,
                description: newBuild.description,
                author_id: 1
            }])
            .select()
            .single();

        if (buildError) return console.error('빌드 저장 실패:', buildError);

        // 2. 생성된 빌드 ID를 가지고 상세 단계들 저장
        const stepsToInsert = newBuild.buildSteps.map((step, index) => ({
            build_id: buildData.id,
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
            // DB 저장 성공 시에만 로컬 상태 업데이트
            fetchBuilds(); 
        }
    };

    const updateBuild = (updatedBuild: BuildItem) => {
        setBuilds((prev) => 
        prev.map((item) => (item.id === updatedBuild.id ? updatedBuild : item))
        );
    };

    const deleteBuild = (id: string) => {
        setBuilds((prev) => prev.filter((item) => item.id !== id));
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
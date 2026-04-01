import React, { createContext, useState, useContext } from 'react';
import { BuildItem } from '../types';
import { BUILD_DATA as INITIAL_DATA } from '../services/dataService';

interface BuildContextType {
  builds: BuildItem[];
  addBuild: (newBuild: BuildItem) => void;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export const BuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [builds, setBuilds] = useState<BuildItem[]>(INITIAL_DATA);

  const addBuild = (newBuild: BuildItem) => {
    setBuilds((prev) => [newBuild, ...prev]); // 새 빌드를 맨 위에 추가
  };

  return (
    <BuildContext.Provider value={{ builds, addBuild }}>
      {children}
    </BuildContext.Provider>
  );
};

export const useBuilds = () => {
  const context = useContext(BuildContext);
  if (!context) throw new Error('useBuilds must be used within a BuildProvider');
  return context;
};
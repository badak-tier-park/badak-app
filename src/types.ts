export interface BuildStep {
    pop: number;
    time: string;
    action: string;
}

export interface BuildItem {
    id: string;
    title: string;
    race: 'T' | 'Z' | 'P';
    matchup: string;
    difficulty: 'Easy' | 'Normal' | 'Hard';
    tags: string[];
    buildSteps: BuildStep[];
}

export type RootStackParamList = {
  Home: undefined;
  Detail: { item: BuildItem };
  AddBuild: { item?: BuildItem };
};
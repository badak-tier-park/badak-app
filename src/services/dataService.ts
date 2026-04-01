import { BuildItem } from '../types';

export const BUILD_DATA: BuildItem[] = [
    { 
        id: '1', 
        title: '초보자 필수! 테란 111 정석', 
        race: 'T', 
        matchup: 'TvZ', 
        difficulty: 'Easy', 
        tags: ['정석', '운영'],
        buildSteps: [
            { pop: 9, time: '00:00', action: '서플라이 디폿' },
            { pop: 11, time: '00:00', action: '배럭 건설' },
            { pop: 12, time: '00:00', action: '가스 채취' },
        ]
    },
    { 
        id: '2', 
        title: '9드론 발업 저글링 올인', 
        race: 'Z', 
        matchup: 'ZvP', 
        difficulty: 'Normal', 
        tags: ['날빌', '공격'], 
        buildSteps: [
            { pop: 9, time: '00:00', action: '스포닝풀 건설' },
            { pop: 8, time: '00:00', action: '드론 생산' },
            { pop: 9, time: '00:00', action: '가스 건설' },
            { pop: 8, time: '00:00', action: '오버로드 생산' },
            { pop: 8, time: '00:00', action: '드론 생산' },
            { pop: 9, time: '00:00', action: '가스 채취' },
            { pop: 9, time: '00:00', action: '3저글링 생산' },
            { pop: 12, time: '00:00', action: '저글링 발업 업그레이드' },
        ] 
    },
    { 
        id: '3', 
        title: '안전한 2게이트 로보틱스', 
        race: 'P', 
        matchup: 'PvT', 
        difficulty: 'Easy', 
        tags: ['방어', '정석'], 
        buildSteps: [
            { pop: 9, time: '00:00', action: '서플라이 디폿' },
            { pop: 11, time: '00:00', action: '배럭 건설' },
            { pop: 12, time: '00:00', action: '가스 채취' },
            { pop: 15, time: '00:00', action: '서플라이 디폿' },
            { pop: 16, time: '00:00', action: '팩토리 건설' },
        ]
    },
];
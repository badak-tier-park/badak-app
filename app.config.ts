import 'dotenv/config'; // .env 파일 로딩을 위해 추가
import { ExpoConfig } from 'expo/config'; // ExpoConfig 타입 임포트

// config 파라미터의 타입을 ExpoConfig으로 명시합니다.
export default ({ config }: { config: ExpoConfig }): ExpoConfig => {
  return {
    ...config,
    name: "badak-app",
    slug: "badak-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    // newArchEnabled: true, // New Architecture를 사용하지 않는다면 이 줄은 제거해도 좋습니다.
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      ...config.extra, 
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  };
};
# badak-app

Expo(React Native) 기반 크로스플랫폼 모바일 앱 — Android / iOS 동시 지원.

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Expo | ~54.0 |
| React Native | 0.81 |
| React | 19.1 |
| TypeScript | ~5.9 |

---

## 프로젝트 구조

```
badak-app/
├── App.tsx             # 루트 컴포넌트 (화면 진입점)
├── index.ts            # 앱 등록 진입점 (수정 불필요)
├── app.json            # Expo 앱 메타 설정 (이름, 아이콘, 권한 등)
├── tsconfig.json       # TypeScript 컴파일러 설정
├── package.json
├── assets/
│   ├── icon.png             # 앱 아이콘 (1024x1024)
│   ├── splash-icon.png      # 스플래시 화면 이미지
│   ├── adaptive-icon.png    # Android 적응형 아이콘 (전경)
│   └── favicon.png          # 웹 파비콘
└── node_modules/
```

> 화면/컴포넌트가 늘어나면 아래 구조를 권장합니다.
>
> ```
> badak-app/
> ├── src/
> │   ├── screens/      # 각 페이지 컴포넌트
> │   ├── components/   # 공통 UI 컴포넌트
> │   ├── hooks/        # 커스텀 훅
> │   ├── services/     # API 호출 로직
> │   └── utils/        # 유틸 함수
> └── ...
> ```

---

## 시작하기

### 사전 준비

- Node.js 18 이상
- npm 또는 yarn
- 스마트폰에 [Expo Go](https://expo.dev/go) 앱 설치 (Android / iOS)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

서버가 뜨면 터미널에 QR 코드가 표시됩니다.

---

## 실행 방법

| 방법 | 명령어 / 방법 |
|------|--------------|
| 실제 기기 (Android/iOS) | Expo Go 앱으로 QR 코드 스캔 |
| 웹 브라우저 | 터미널에서 `w` 키 입력 |
| Android 에뮬레이터 | 터미널에서 `a` 키 입력 (Android Studio 필요) |
| iOS 시뮬레이터 | 터미널에서 `i` 키 입력 (Mac + Xcode 필요) |

```bash
# 플랫폼별 직접 실행
npm run android   # Android 에뮬레이터
npm run ios       # iOS 시뮬레이터 (Mac 전용)
npm run web       # 웹 브라우저
```

---

## 빌드 (스토어 배포)

Expo의 클라우드 빌드 서비스 [EAS Build](https://docs.expo.dev/build/introduction/)를 사용합니다.

```bash
# EAS CLI 설치
npm install -g eas-cli

# Expo 계정 로그인
eas login

# 빌드 설정 초기화
eas build:configure

# Android APK/AAB 빌드
eas build --platform android

# iOS IPA 빌드 (Apple Developer 계정 필요)
eas build --platform ios
```

---

## 관련 프로젝트

| 프로젝트 | 설명 |
|---------|------|
| `badak-web` | 웹 프론트엔드 |
| `badak-tier-park-api` | 백엔드 API 서버 |
| `badak-bot` | 봇 서비스 |
| `gg-tracker` | GG 트래커 |

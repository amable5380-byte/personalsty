# Blueprint: Keyword Radar - 소셜 미디어 키워드 모니터링 & 요약기

## 개요
특정 키워드(예: "바이브 코딩", "오세현", "AI 자동화")가 인터넷 및 소셜 미디어에서 어떻게 회자되는지 실시간으로 감시하고, 그 내용을 AI를 통해 요약하여 브리핑해주는 대시보드 애플리케이션입니다.

## 주요 기능
- **키워드 등록**: 감시할 키워드를 등록하고 관리합니다.
- **실시간 레이더 모니터링**: 등록된 키워드에 대한 새로운 언급을 시각적으로 레이더 화면에 표시합니다.
- **AI 요약 브리핑**: 수집된 방대한 데이터를 핵심 주제와 분위기(Sentimental)로 요약합니다.
- **트렌드 분석**: 언급량 변화와 주요 채널별 분포를 차트로 보여줍니다.

## 기술 스택
- **Frontend**: React (Vite), TypeScript
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Dark UI Theme)

## 디자인 컨셉
- **Theme**: Cyberpunk/High-tech Dark Theme
- **Color Palette**: 
  - Background: #0a0a0c
  - Surface: #16161a
  - Accent: #39FF14 (Neon Green), #00E5FF (Electric Blue)
- **Effects**: Glassmorphism, Glow effects, Subtle noise textures

## Cloudflare 배포 설정 가이드 (GitHub 연동)
출력 화면이 업데이트되지 않을 경우 아래 사항을 확인해 주세요:
- **Source Repository**: `amable5380-byte/personalsty`로 연동되어 있는지 확인.
- **Production Branch**: `main`으로 설정.
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`
- **Node.js Version**: `20` 이상 (Vite 7 요구 사항)

GitHub에 푸시된 최신 코드가 Cloudflare Pages에서 자동으로 빌드 및 배포됩니다.

## 진행 상황
- [x] 프로젝트 계획 수립
- [x] 기본 의존성 설치 (lucide-react, framer-motion)
- [x] UI 테마 및 레이아웃 구현
- [x] 레이더 애니메이션 컴포넌트 구현
- [x] 키워드 관리 및 데이터 시뮬레이션 구현
- [x] 요약 패널 및 차트 구현
- [x] Cloudflare 배포 가이드 추가

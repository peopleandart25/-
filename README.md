# NOVA HOUSE

배우, 가수, 모델, 크리에이터를 위한 크리에이티브 엔터테인먼트 컴퍼니 **NOVA HOUSE**의 공식 반응형 홈페이지입니다.

패션 매거진과 아트 디렉션 스튜디오가 만난 듯한 편집 디자인으로, 따뜻한 아이보리 배경과 짙은 네이비, 코랄 포인트를 사용합니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
cd "C:\Users\FAMILY\Desktop\NOVA HOUSE"
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 이 열립니다.

빌드:

```bash
npm run build
npm run preview
```

## 주요 파일 구조

```
NOVA HOUSE/
├── index.html
├── package.json
├── vite.config.ts
├── public/favicon.svg
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types/index.ts
    ├── data/
    │   ├── artists.ts
    │   ├── projects.ts
    │   ├── journal.ts
    │   ├── nav.ts
    │   └── company.ts
    ├── hooks/
    │   ├── useActiveSection.ts
    │   ├── useCountUp.ts
    │   └── useDragScroll.ts
    └── components/
        ├── Header.tsx
        ├── MobileMenu.tsx
        ├── HeroSection.tsx
        ├── ArtistSection.tsx
        ├── ArtistCard.tsx
        ├── ArtistFilter.tsx
        ├── AboutSection.tsx
        ├── StatsCounter.tsx
        ├── ProjectsSection.tsx
        ├── ProjectCard.tsx
        ├── JournalSection.tsx
        ├── JournalCard.tsx
        ├── ContactSection.tsx
        ├── Footer.tsx
        └── ScrollToTopButton.tsx
```

데이터는 `src/data`에서 관리하며, 문의 폼은 프론트엔드 검증과 성공 상태만 구현되어 있습니다.

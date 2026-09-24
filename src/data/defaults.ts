import type {
  AgencyData,
  Artist,
  ArtistFolder,
  Banner,
  NewsItem,
} from "../types";
import { defaultFooter, defaultSiteContent } from "./company";
import { journalPosts } from "./journal";

export const defaultCategories: ArtistFolder[] = [
  { id: "actor", nameKo: "배우", nameEn: "ACTOR", order: 0 },
  { id: "musician", nameKo: "가수", nameEn: "MUSICIAN", order: 1 },
  { id: "creator", nameKo: "크리에이터", nameEn: "CREATOR", order: 2 },
];

export const defaultBanners: Banner[] = [
  {
    id: "banner-main",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2400&q=80",
    imageMobile: "",
    title: "P.A E&M",
    subtitle: "MAKE YOUR OWN LIGHT.",
    order: 0,
  },
  {
    id: "banner-seojin",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2400&q=80",
    imageMobile: "",
    title: "SEOJIN YOON",
    subtitle: "ACTOR",
    order: 1,
  },
  {
    id: "banner-doyun",
    image:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=2400&q=80",
    imageMobile: "",
    title: "DOYUN HAN",
    subtitle: "MUSICIAN",
    order: 2,
  },
  {
    id: "banner-harin",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=2400&q=80",
    imageMobile: "",
    title: "HARIN KIM",
    subtitle: "ACTOR",
    order: 3,
  },
  {
    id: "banner-soyul",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=80",
    imageMobile: "",
    title: "SOYUL PARK",
    subtitle: "CREATOR",
    order: 4,
  },
];

export const defaultArtists: Artist[] = [
  {
    id: "seojin-yoon",
    categoryId: "actor",
    name: "윤서진",
    englishName: "SEOJIN YOON",
    profileImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80",
    career: [
      "AFTERGLOW — 웹드라마 주연 (2025)",
      "THE OTHER ROOM — 단편 공동 주연 (2024)",
      "창작 낭독극 <밤의 온도> — 출연 (2023)",
      "카메라 앞에서 말이 없어도 공간이 바뀌는 배우. 일상적인 제스처 안에 긴장을 쌓아 올리고, 관계의 균열을 섬세하게 읽습니다.",
    ].join("\n"),
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80",
    ],
    order: 0,
  },
  {
    id: "harin-kim",
    categoryId: "actor",
    name: "김하린",
    englishName: "HARIN KIM",
    profileImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    career: [
      "CITY LIGHTS — 브랜드 필름 출연 (2024)",
      "AFTERGLOW — 특별 출연 (2025)",
      "스테이지 리딩 <오늘의 속도> (2024)",
      "밝은 리듬 속에 날카로운 타이밍을 숨기는 배우. 코미디와 청춘물을 중심으로, 인물의 속도감을 장면의 공기처럼 다루는 연기를 추구합니다.",
    ].join("\n"),
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1400&q=80",
    ],
    order: 1,
  },
  {
    id: "doyun-han",
    categoryId: "musician",
    name: "한도윤",
    englishName: "DOYUN HAN",
    profileImage:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1600&q=80",
    career: [
      "ORANGE MOON — 싱글 앨범 (2025)",
      "SLOW DANCE — 피처링 & 공동 작곡 (2023)",
      "서울 인디 서클 라이브 시리즈 (2022–2024)",
      "도시적 감성과 아날로그 질감을 겹쳐 쓰는 싱어송라이터. 멜로디보다 숨의 간격을 먼저 설계하고, 가사에는 짧은 시처럼 공백을 남깁니다.",
    ].join("\n"),
    gallery: [
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80",
    ],
    order: 0,
  },
  {
    id: "soyul-park",
    categoryId: "creator",
    name: "박소율",
    englishName: "SOYUL PARK",
    profileImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
    career: [
      "SLOW DANCE — 내레이션 및 사운드 (2023)",
      "ORANGE MOON — 보이스 디렉션 (2025)",
      "문학의 집 사운드 퍼포먼스 (2024)",
      "목소리의 결을 언어처럼 다루는 크리에이터. 시적인 내레이션과 사운드 에세이를 바탕으로, 공연과 영상 작업에서 장면의 여운을 책임집니다.",
    ].join("\n"),
    gallery: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
    ],
    order: 0,
  },
  {
    id: "junho-lee",
    categoryId: "creator",
    name: "이준호",
    englishName: "JUNHO LEE",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=80",
    career: [
      "CITY LIGHTS — 메인 비주얼 (2024)",
      "서울 패션 위크 게스트 워크 (2024)",
      "독립 매거진 COVER STORY Vol.18 (2023)",
      "정면을 바라보는 시선이 먼저 남는 모델. 패션 에디토리얼과 캠페인에서 과장 없는 실루엣과 컨템포러리한 태도를 보여줍니다.",
    ].join("\n"),
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80",
    ],
    order: 1,
  },
];

export const defaultNews: NewsItem[] = journalPosts.map((post) => ({
  id: post.id,
  title: post.title,
  date: post.date,
  excerpt: post.excerpt,
  body: post.body,
  image: post.image,
}));

export const defaultAgencyData: AgencyData = {
  banners: defaultBanners,
  categories: defaultCategories,
  artists: defaultArtists,
  news: defaultNews,
  inquiries: [],
  copy: defaultSiteContent,
  footer: defaultFooter,
};

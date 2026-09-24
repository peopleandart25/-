import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "afterglow",
    title: "AFTERGLOW",
    field: "Web Drama",
    year: "2025",
    artists: ["윤서진", "김하린"],
    synopsis:
      "하루가 끝난 뒤에도 남는 빛에 대한 이야기. 서로 다른 속도로 살아온 두 사람이 같은 골목에서 마주치며, 관계의 잔광을 천천히 들여다봅니다.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "웹드라마 AFTERGLOW 촬영 장면",
    objectPosition: "center 40%",
    aspect: "aspect-[4/5]",
    accent: "number",
  },
  {
    id: "orange-moon",
    title: "ORANGE MOON",
    field: "Single Album",
    year: "2025",
    artists: ["한도윤", "박소율"],
    synopsis:
      "밤의 중간 음역을 탐구한 싱글. 미니멀한 리듬 위에 숨과 여백을 두고, 달이 주황으로 물드는 순간의 온도를 사운드로 옮겼습니다.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "싱글 앨범 ORANGE MOON 비주얼",
    objectPosition: "center 30%",
    aspect: "aspect-square",
    accent: "category",
  },
  {
    id: "the-other-room",
    title: "THE OTHER ROOM",
    field: "Short Film",
    year: "2024",
    artists: ["윤서진"],
    synopsis:
      "문이 하나 더 있는 집에서 벌어지는 짧은 침묵극. 공간의 레이어와 인물의 시선이 교차하며, 보이지 않는 방을 상상하게 합니다.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "단편영화 THE OTHER ROOM 스틸",
    objectPosition: "center 35%",
    aspect: "aspect-[3/4]",
    accent: "line",
  },
  {
    id: "city-lights",
    title: "CITY LIGHTS",
    field: "Brand Campaign",
    year: "2024",
    artists: ["이준호", "김하린"],
    synopsis:
      "도시의 불빛과 사람의 윤곽을 나란히 둔 브랜드 캠페인. 과장된 연출 대신, 걸음과 시선의 리듬으로 태도를 전달합니다.",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "브랜드 캠페인 CITY LIGHTS 야경 장면",
    objectPosition: "center 45%",
    aspect: "aspect-[5/6]",
    accent: "icon",
  },
  {
    id: "slow-dance",
    title: "SLOW DANCE",
    field: "Music Video",
    year: "2023",
    artists: ["박소율", "한도윤"],
    synopsis:
      "춤추지 않아도 춤이 되는 순간을 담은 뮤직비디오. 느린 제스처, 창가의 먼지, 멀어지듯 남는 피아노가 한 편의 시처럼 이어집니다.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "뮤직비디오 SLOW DANCE 장면",
    objectPosition: "center 25%",
    aspect: "aspect-[4/5]",
    accent: "year",
  },
];

export function getProjectsByArtistName(name: string) {
  return projects.filter((project) => project.artists.includes(name));
}

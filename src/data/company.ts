import type { FooterInfo, SiteContent, StatItem } from "../types";

export const BRAND_SHORT = "P.A E&M";
export const BRAND_NAME = "P.A(PEOPLE & ART) E&M";

export const company = {
  nameKo: BRAND_NAME,
  nameEn: BRAND_NAME,
  address: "서울특별시 강남구 도산대로 318, 3층",
  email: "hello@pa-enm.com",
  phone: "+82 2 512 0918",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  instagramHandle: "@pia.entertainment",
  youtubeHandle: BRAND_NAME,
};

export const defaultFooter: FooterInfo = {
  blurb:
    "P.A(PEOPLE & ART) E&M은 배우, 가수, 모델, 방송인, 크리에이터의 고유한 매력을 발견하고, 각자의 가능성이 오래도록 빛날 수 있도록 함께 성장합니다.",
  address: company.address,
  email: company.email,
  phone: company.phone,
  instagram: company.instagram,
  instagramHandle: company.instagramHandle,
  youtube: company.youtube,
  youtubeHandle: company.youtubeHandle,
};

export const defaultSiteContent: SiteContent = {
  kicker: "ABOUT",
  headline: "MAKE YOUR OWN LIGHT.",
  slogan: "YOUR MOMENT, OUR VISION.",
  homeSlogan: "YOUR MOMENT, OUR VISION.",
  visionLabel: "VISION",
  vision:
    "아티스트의 고유한 빛이 무대와 화면 너머까지 오래 남도록, 매니지먼트와 콘텐츠를 함께 설계합니다.",
  aboutIntro:
    "P.A(PEOPLE & ART) E&M은 아티스트의 고유한 매력과 가능성을 발견하고, 장기적인 커리어를 함께 설계하는 종합 엔터테인먼트 회사입니다.",
  aboutSupport:
    "매니지먼트를 기반으로 콘텐츠 기획, 브랜드 협업, 공연, 방송, 영상 제작, 글로벌 활동까지 아티스트의 활동 전반을 지원합니다.",
};

export const stats: StatItem[] = [
  {
    value: 12,
    suffix: "+",
    pad: 2,
    label: "Artists",
    caption: "배우, 가수, 모델, 크리에이터",
  },
  {
    value: 8,
    suffix: "",
    pad: 2,
    label: "Years",
    caption: "서울에서 쌓아 온 매니지먼트",
  },
  {
    value: 35,
    suffix: "+",
    pad: 2,
    label: "Projects",
    caption: "드라마, 음악, 캠페인, 퍼포먼스",
  },
  {
    value: 6,
    suffix: "",
    pad: 2,
    label: "Fields",
    caption: "연기, 음악, 패션, 콘텐츠",
  },
];

export const privacyPolicy = {
  title: "Privacy Policy",
  updated: "2026.09.01",
  paragraphs: [
    "P.A(PEOPLE & ART) E&M(이하 ‘회사’)는 문의 폼을 통해 수집되는 이름, 회사명, 연락처, 문의 유형 및 내용을 협업 검토 목적으로만 사용합니다.",
    "수집된 정보는 문의 처리가 완료된 뒤 최대 1년간 보관되며, 당사자의 삭제 요청이 있을 경우 지체 없이 파기합니다.",
    "회사는 법령에 따른 경우를 제외하고 제3자에게 개인정보를 제공하지 않습니다.",
    "개인정보 관련 문의는 hello@pa-enm.com 로 연락해 주세요.",
  ],
};

export const termsOfUse = {
  title: "Terms of Use",
  updated: "2026.09.01",
  paragraphs: [
    "본 웹사이트에 게시된 텍스트, 이미지, 아티스트 프로필 및 프로젝트 자료의 저작권은 P.A(PEOPLE & ART) E&M 또는 해당 권리자에게 있습니다.",
    "사이트 내 정보는 소개를 위한 것이며, 섭외 및 협업은 별도의 서면 합의 후 확정됩니다.",
    "사용자는 사이트의 콘텐츠를 무단으로 복제, 재배포, 상업적 이용할 수 없습니다.",
    "문의 내용에 포함된 제안은 검토 대상이 될 수 있으나, 회신이 모든 건에 대해 보장되지는 않습니다.",
  ],
};

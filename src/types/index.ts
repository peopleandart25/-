export interface Banner {
  id: string;
  image: string;
  imageMobile: string;
  title: string;
  subtitle: string;
  order: number;
}

export interface ArtistFolder {
  id: string;
  nameKo: string;
  nameEn: string;
  order: number;
}

export interface Artist {
  id: string;
  categoryId: string;
  name: string;
  englishName: string;
  profileImage: string;
  career: string;
  gallery: string[];
  order: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  image: string;
}

export interface FooterInfo {
  blurb: string;
  address: string;
  email: string;
  phone: string;
  instagram: string;
  instagramHandle: string;
  youtube: string;
  youtubeHandle: string;
}

export interface SiteCopy {
  kicker: string;
  headline: string;
  slogan: string;
  homeSlogan: string;
  visionLabel: string;
  vision: string;
  aboutIntro: string;
  aboutSupport: string;
}

export const INQUIRY_TYPE_KEYS = [
  "booking",
  "artist",
  "brand",
  "broadcast",
  "content",
  "other",
] as const;

export type InquiryTypeKey = (typeof INQUIRY_TYPE_KEYS)[number];

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  phone: string;
  type: InquiryTypeKey;
  typeLabel: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AgencyData {
  banners: Banner[];
  categories: ArtistFolder[];
  artists: Artist[];
  news: NewsItem[];
  inquiries: Inquiry[];
  copy: SiteCopy;
  footer: FooterInfo;
}

export type SiteContent = SiteCopy;

export type ProjectField =
  | "Web Drama"
  | "Single Album"
  | "Short Film"
  | "Brand Campaign"
  | "Music Video";

export type ProjectAccent = "number" | "category" | "line" | "icon" | "year";

export interface Project {
  id: string;
  title: string;
  field: ProjectField;
  year: string;
  artists: string[];
  synopsis: string;
  image: string;
  imageAlt: string;
  objectPosition: string;
  aspect: string;
  accent: ProjectAccent;
}

export type JournalCategory = "NEWS" | "INTERVIEW" | "BEHIND" | "RELEASE";

export interface JournalPost {
  id: string;
  category: JournalCategory;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  to: string;
  children?: { id: string; label: string; to: string }[];
}

export interface StatItem {
  value: number;
  suffix: string;
  pad: number;
  label: string;
  caption: string;
}

export type InquiryType = InquiryTypeKey;

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultAgencyData } from "../data/defaults";
import { createId, slugify } from "../lib/id";
import { getAdminPassword, isAdminLoggedIn } from "../lib/adminAuth";
import { fetchAgency, postInquiry, saveAgency } from "../lib/cmsClient";
import type {
  AgencyData,
  Artist,
  ArtistFolder,
  Banner,
  FooterInfo,
  Inquiry,
  InquiryTypeKey,
  NewsItem,
  SiteCopy,
} from "../types";
import { INQUIRY_TYPE_KEYS } from "../types";

const STORAGE_KEY = "pa-entertainment-agency-v1";

function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

function reindex<T extends { order: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, order: index }));
}

function moveItem<T extends { id: string; order: number }>(
  items: T[],
  id: string,
  direction: "up" | "down",
) {
  const sorted = sortByOrder(items);
  const index = sorted.findIndex((item) => item.id === id);
  if (index < 0) return sorted;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= sorted.length) return sorted;
  const next = [...sorted];
  const current = next[index];
  const swap = next[target];
  if (!current || !swap) return sorted;
  next[index] = swap;
  next[target] = current;
  return reindex(next);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = "") {
  const text = typeof value === "string" ? value : fallback;
  return text
    .replaceAll("피아 엔터테인먼트", "P.A(PEOPLE & ART) E&M")
    .replaceAll("P.A ENTERTAINMENT", "P.A(PEOPLE & ART) E&M")
    .replaceAll("P.A (PEOPLE&ART)", "P.A(PEOPLE & ART) E&M")
    .replaceAll("P.A (PEOPLE & ART)", "P.A(PEOPLE & ART) E&M");
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseBanners(value: unknown): Banner[] {
  if (!Array.isArray(value)) return defaultAgencyData.banners;
  const parsed = value
    .filter(isRecord)
    .map((item, index) => ({
      id: asString(item.id, createId("banner")),
      image: asString(item.image),
      imageMobile: asString(item.imageMobile),
      title: asString(item.title),
      subtitle: asString(item.subtitle),
      order: asNumber(item.order, index),
    }))
    .filter((item) => item.image || item.imageMobile);
  return parsed.length > 0 ? parsed : defaultAgencyData.banners;
}

function parseCategories(value: unknown): ArtistFolder[] {
  if (!Array.isArray(value)) return defaultAgencyData.categories;
  const parsed = value
    .filter(isRecord)
    .map((item, index) => ({
      id: asString(item.id, createId("folder")),
      nameKo: asString(item.nameKo),
      nameEn: asString(item.nameEn),
      order: asNumber(item.order, index),
    }))
    .filter((item) => item.id && (item.nameKo || item.nameEn));
  return parsed.length > 0 ? parsed : defaultAgencyData.categories;
}

function parseArtists(value: unknown): Artist[] {
  if (!Array.isArray(value)) return defaultAgencyData.artists;
  return value.filter(isRecord).map((item, index) => ({
    id: asString(item.id, createId("artist")),
    categoryId: asString(item.categoryId),
    name: asString(item.name),
    englishName: asString(item.englishName),
    profileImage: asString(item.profileImage),
    career: asString(item.career),
    gallery: Array.isArray(item.gallery)
      ? item.gallery.filter((entry): entry is string => typeof entry === "string")
      : [],
    order: asNumber(item.order, index),
  }));
}

function parseNews(value: unknown): NewsItem[] {
  if (!Array.isArray(value)) return defaultAgencyData.news;
  return value.filter(isRecord).map((item) => ({
    id: asString(item.id, createId("news")),
    title: asString(item.title),
    date: asString(item.date),
    excerpt: asString(item.excerpt),
    body: asString(item.body),
    image: asString(item.image),
  }));
}

function isInquiryType(value: string): value is InquiryTypeKey {
  return (INQUIRY_TYPE_KEYS as readonly string[]).includes(value);
}

function parseInquiries(value: unknown): Inquiry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => {
      const typeRaw = asString(item.type, "other");
      const type: InquiryTypeKey = isInquiryType(typeRaw) ? typeRaw : "other";
      return {
        id: asString(item.id, createId("inquiry")),
        name: asString(item.name),
        company: asString(item.company),
        phone: asString(item.phone),
        type,
        typeLabel: asString(item.typeLabel, type),
        message: asString(item.message),
        createdAt: asString(item.createdAt, new Date().toISOString()),
        read: item.read === true,
      };
    })
    .filter((item) => item.name && item.phone && item.message);
}

function parseFooter(value: unknown): FooterInfo {
  const base = defaultAgencyData.footer;
  if (!isRecord(value)) return base;
  return {
    blurb: asString(value.blurb, base.blurb),
    address: asString(value.address, base.address),
    email: asString(value.email, base.email),
    phone: asString(value.phone, base.phone),
    instagram: asString(value.instagram, base.instagram),
    instagramHandle: asString(value.instagramHandle, base.instagramHandle),
    youtube: asString(value.youtube, base.youtube),
    youtubeHandle: asString(value.youtubeHandle, base.youtubeHandle),
  };
}

function parseCopy(value: unknown): SiteCopy {
  const base = defaultAgencyData.copy;
  if (!isRecord(value)) return base;
  return {
    kicker: asString(value.kicker, base.kicker),
    headline: asString(value.headline, base.headline),
    slogan: asString(value.slogan, base.slogan),
    homeSlogan: asString(value.homeSlogan, base.homeSlogan),
    visionLabel: asString(value.visionLabel, base.visionLabel),
    vision: asString(value.vision, base.vision),
    aboutIntro: asString(value.aboutIntro, base.aboutIntro),
    aboutSupport: asString(value.aboutSupport, base.aboutSupport),
  };
}

function parseAgencyData(parsed: unknown): AgencyData {
  if (!isRecord(parsed)) return defaultAgencyData;
  return {
    banners: parseBanners(parsed.banners),
    categories: parseCategories(parsed.categories),
    artists: parseArtists(parsed.artists),
    news: parseNews(parsed.news),
    inquiries: parseInquiries(parsed.inquiries),
    copy: parseCopy(parsed.copy),
    footer: parseFooter(parsed.footer),
  };
}

function readStoredData(): AgencyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAgencyData;
    return parseAgencyData(JSON.parse(raw) as unknown);
  } catch {
    return defaultAgencyData;
  }
}

export const STORAGE_FULL_MESSAGE =
  "브라우저 저장 공간이 가득 찼습니다. 이미지를 더 작게 올리거나 기존 항목을 삭제해 주세요.";

interface AgencyContextValue {
  banners: Banner[];
  categories: ArtistFolder[];
  artists: Artist[];
  news: AgencyData["news"];
  inquiries: Inquiry[];
  copy: SiteCopy;
  footer: FooterInfo;
  storageError: string | null;
  cmsConfigured: boolean;
  syncStatus: "loading" | "remote" | "local";
  clearStorageError: () => void;
  addBanner: (
    input?: Partial<Pick<Banner, "image" | "imageMobile" | "title" | "subtitle">>,
  ) => boolean;
  updateBanner: (id: string, patch: Partial<Banner>) => boolean;
  removeBanner: (id: string) => boolean;
  moveBanner: (id: string, direction: "up" | "down") => boolean;
  addCategory: (input: Pick<ArtistFolder, "nameKo" | "nameEn"> & { id?: string }) => boolean;
  updateCategory: (id: string, patch: Partial<ArtistFolder>) => boolean;
  removeCategory: (id: string) => boolean;
  moveCategory: (id: string, direction: "up" | "down") => boolean;
  addArtist: (
    input: Omit<Artist, "id" | "order"> & { id?: string },
  ) => boolean;
  updateArtist: (id: string, patch: Partial<Artist>) => boolean;
  removeArtist: (id: string) => boolean;
  addNews: (input: Omit<NewsItem, "id"> & { id?: string }) => boolean;
  updateNews: (id: string, patch: Partial<NewsItem>) => boolean;
  removeNews: (id: string) => boolean;
  addInquiry: (
    input: Omit<Inquiry, "id" | "createdAt" | "read">,
  ) => boolean;
  markInquiryRead: (id: string) => boolean;
  removeInquiry: (id: string) => boolean;
  updateFooter: (patch: Partial<FooterInfo>) => boolean;
  updateCopy: (patch: Partial<SiteCopy>) => boolean;
  getArtist: (id: string) => Artist | undefined;
  getNews: (id: string) => NewsItem | undefined;
  getCategory: (id: string) => ArtistFolder | undefined;
  artistsInCategory: (categoryId: string) => Artist[];
  resetAll: () => void;
}

const AgencyContext = createContext<AgencyContextValue | null>(null);

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AgencyData>(readStoredData);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [cmsConfigured, setCmsConfigured] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"loading" | "remote" | "local">(
    "loading",
  );
  const dataRef = useRef(data);
  const dirtyRef = useRef(false);
  const cmsConfiguredRef = useRef(false);
  const pushTimer = useRef(0);
  dataRef.current = data;

  const persistLocal = useCallback((next: AgencyData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setData(next);
      setStorageError(null);
      return true;
    } catch {
      setStorageError(STORAGE_FULL_MESSAGE);
      return false;
    }
  }, []);

  const schedulePush = useCallback((next: AgencyData) => {
    if (!cmsConfiguredRef.current || !isAdminLoggedIn()) return;
    window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(() => {
      void (async () => {
        try {
          const saved = await saveAgency(next, getAdminPassword());
          persistLocal(saved);
          setSyncStatus("remote");
        } catch {
          setStorageError(
            "이 기기에는 저장됐지만, 사이트 전체에 반영하지 못했습니다. 네트워크를 확인한 뒤 다시 저장해 주세요.",
          );
        }
      })();
    }, 700);
  }, [persistLocal]);

  const commit = useCallback(
    (next: AgencyData) => {
      dirtyRef.current = true;
      const ok = persistLocal(next);
      if (ok) schedulePush(next);
      return ok;
    },
    [persistLocal, schedulePush],
  );

  useEffect(() => {
    let cancelled = false;
    const password = isAdminLoggedIn() ? getAdminPassword() : undefined;
    void fetchAgency(password).then((snapshot) => {
      if (cancelled) return;
      cmsConfiguredRef.current = snapshot.configured;
      setCmsConfigured(snapshot.configured);
      if (dirtyRef.current) {
        setSyncStatus(snapshot.configured ? "remote" : "local");
        if (snapshot.configured) schedulePush(dataRef.current);
        return;
      }
      if (snapshot.data) {
        const local = readStoredData();
        const next = parseAgencyData({
          ...snapshot.data,
          inquiries: isAdminLoggedIn()
            ? snapshot.data.inquiries
            : local.inquiries,
        });
        persistLocal(next);
        setSyncStatus("remote");
        return;
      }
      setSyncStatus(snapshot.configured ? "remote" : "local");
      if (snapshot.configured && isAdminLoggedIn()) {
        schedulePush(readStoredData());
      }
    });
    return () => {
      cancelled = true;
      window.clearTimeout(pushTimer.current);
    };
  }, [persistLocal, schedulePush]);

  const addBanner = useCallback(
    (
      input: Partial<
        Pick<Banner, "image" | "imageMobile" | "title" | "subtitle">
      > = {},
    ) => {
      const banners = sortByOrder(data.banners);
      return commit({
        ...data,
        banners: reindex([
          ...banners,
          {
            id: createId("banner"),
            image: input.image ?? "",
            imageMobile: input.imageMobile ?? "",
            title: input.title ?? "",
            subtitle: input.subtitle ?? "",
            order: banners.length,
          },
        ]),
      });
    },
    [commit, data],
  );

  const updateBanner = useCallback(
    (id: string, patch: Partial<Banner>) =>
      commit({
        ...data,
        banners: data.banners.map((item) =>
          item.id === id ? { ...item, ...patch, id: item.id } : item,
        ),
      }),
    [commit, data],
  );

  const removeBanner = useCallback(
    (id: string) =>
      commit({
        ...data,
        banners: reindex(sortByOrder(data.banners).filter((item) => item.id !== id)),
      }),
    [commit, data],
  );

  const moveBanner = useCallback(
    (id: string, direction: "up" | "down") =>
      commit({ ...data, banners: moveItem(data.banners, id, direction) }),
    [commit, data],
  );

  const addCategory = useCallback(
    (input: Pick<ArtistFolder, "nameKo" | "nameEn"> & { id?: string }) => {
      const folders = sortByOrder(data.categories);
      const requested = slugify(input.id || input.nameEn || input.nameKo, "");
      const unique = requested
        ? folders.some((folder) => folder.id === requested)
          ? `${requested}-${createId("f")}`
          : requested
        : createId("folder");
      return commit({
        ...data,
        categories: reindex([
          ...folders,
          {
            id: unique,
            nameKo: input.nameKo.trim(),
            nameEn: input.nameEn.trim().toUpperCase(),
            order: folders.length,
          },
        ]),
      });
    },
    [commit, data],
  );

  const updateCategory = useCallback(
    (id: string, patch: Partial<ArtistFolder>) =>
      commit({
        ...data,
        categories: data.categories.map((folder) =>
          folder.id === id
            ? {
                ...folder,
                ...patch,
                id: folder.id,
                nameEn: patch.nameEn
                  ? patch.nameEn.trim().toUpperCase()
                  : folder.nameEn,
              }
            : folder,
        ),
      }),
    [commit, data],
  );

  const removeCategory = useCallback(
    (id: string) =>
      commit({
        ...data,
        categories: reindex(
          sortByOrder(data.categories).filter((folder) => folder.id !== id),
        ),
        artists: data.artists.filter((artist) => artist.categoryId !== id),
      }),
    [commit, data],
  );

  const moveCategory = useCallback(
    (id: string, direction: "up" | "down") =>
      commit({
        ...data,
        categories: moveItem(data.categories, id, direction),
      }),
    [commit, data],
  );

  const addArtist = useCallback(
    (input: Omit<Artist, "id" | "order"> & { id?: string }) => {
      const siblings = data.artists.filter(
        (artist) => artist.categoryId === input.categoryId,
      );
      const base = slugify(
        input.id || input.englishName || input.name,
        createId("artist"),
      );
      const unique = data.artists.some((artist) => artist.id === base)
        ? `${base}-${createId("a")}`
        : base;
      return commit({
        ...data,
        artists: [
          ...data.artists,
          {
            ...input,
            id: unique,
            name: input.name.trim(),
            englishName: input.englishName.trim().toUpperCase(),
            order: siblings.length,
          },
        ],
      });
    },
    [commit, data],
  );

  const updateArtist = useCallback(
    (id: string, patch: Partial<Artist>) =>
      commit({
        ...data,
        artists: data.artists.map((artist) =>
          artist.id === id
            ? {
                ...artist,
                ...patch,
                id: artist.id,
                englishName: patch.englishName
                  ? patch.englishName.trim().toUpperCase()
                  : artist.englishName,
              }
            : artist,
        ),
      }),
    [commit, data],
  );

  const removeArtist = useCallback(
    (id: string) =>
      commit({
        ...data,
        artists: data.artists.filter((artist) => artist.id !== id),
      }),
    [commit, data],
  );

  const addNews = useCallback(
    (input: Omit<NewsItem, "id"> & { id?: string }) => {
      const id = input.id?.trim() || createId("news");
      const unique = data.news.some((item) => item.id === id)
        ? `${id}-${createId("n")}`
        : id;
      return commit({
        ...data,
        news: [
          {
            id: unique,
            title: input.title.trim(),
            date: input.date.trim(),
            excerpt: input.excerpt.trim(),
            body: input.body.trim(),
            image: input.image,
          },
          ...data.news,
        ],
      });
    },
    [commit, data],
  );

  const updateNews = useCallback(
    (id: string, patch: Partial<NewsItem>) =>
      commit({
        ...data,
        news: data.news.map((item) =>
          item.id === id ? { ...item, ...patch, id: item.id } : item,
        ),
      }),
    [commit, data],
  );

  const removeNews = useCallback(
    (id: string) =>
      commit({
        ...data,
        news: data.news.filter((item) => item.id !== id),
      }),
    [commit, data],
  );

  const addInquiry = useCallback(
    (input: Omit<Inquiry, "id" | "createdAt" | "read">) => {
      const inquiry: Inquiry = {
        id: createId("inquiry"),
        name: input.name.trim(),
        company: input.company.trim(),
        phone: input.phone.trim(),
        type: input.type,
        typeLabel: input.typeLabel.trim(),
        message: input.message.trim(),
        createdAt: new Date().toISOString(),
        read: false,
      };
      const ok = persistLocal({
        ...data,
        inquiries: [inquiry, ...(data.inquiries ?? [])],
      });
      if (ok) void postInquiry(inquiry);
      return ok;
    },
    [data, persistLocal],
  );

  const markInquiryRead = useCallback(
    (id: string) =>
      commit({
        ...data,
        inquiries: (data.inquiries ?? []).map((item) =>
          item.id === id ? { ...item, read: true } : item,
        ),
      }),
    [commit, data],
  );

  const removeInquiry = useCallback(
    (id: string) =>
      commit({
        ...data,
        inquiries: (data.inquiries ?? []).filter((item) => item.id !== id),
      }),
    [commit, data],
  );

  const updateFooter = useCallback(
    (patch: Partial<FooterInfo>) =>
      commit({
        ...data,
        footer: { ...(data.footer ?? defaultAgencyData.footer), ...patch },
      }),
    [commit, data],
  );

  const updateCopy = useCallback(
    (patch: Partial<SiteCopy>) =>
      commit({
        ...data,
        copy: { ...(data.copy ?? defaultAgencyData.copy), ...patch },
      }),
    [commit, data],
  );

  const getArtist = useCallback(
    (id: string) => data.artists.find((artist) => artist.id === id),
    [data.artists],
  );

  const getNews = useCallback(
    (id: string) => (data.news ?? defaultAgencyData.news).find((item) => item.id === id),
    [data.news],
  );

  const getCategory = useCallback(
    (id: string) => data.categories.find((folder) => folder.id === id),
    [data.categories],
  );

  const artistsInCategory = useCallback(
    (categoryId: string) =>
      sortByOrder(
        data.artists.filter((artist) => artist.categoryId === categoryId),
      ),
    [data.artists],
  );

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStorageError(null);
    setData(defaultAgencyData);
    dirtyRef.current = true;
    schedulePush(defaultAgencyData);
  }, [schedulePush]);

  const clearStorageError = useCallback(() => setStorageError(null), []);

  const value = useMemo<AgencyContextValue>(
    () => ({
      banners: sortByOrder(data.banners),
      categories: sortByOrder(data.categories),
      artists: data.artists,
      news: data.news ?? defaultAgencyData.news,
      inquiries: data.inquiries ?? [],
      copy: { ...defaultAgencyData.copy, ...data.copy },
      footer: data.footer ?? defaultAgencyData.footer,
      storageError,
      cmsConfigured,
      syncStatus,
      clearStorageError,
      addBanner,
      updateBanner,
      removeBanner,
      moveBanner,
      addCategory,
      updateCategory,
      removeCategory,
      moveCategory,
      addArtist,
      updateArtist,
      removeArtist,
      addNews,
      updateNews,
      removeNews,
      addInquiry,
      markInquiryRead,
      removeInquiry,
      updateFooter,
      updateCopy,
      getArtist,
      getNews,
      getCategory,
      artistsInCategory,
      resetAll,
    }),
    [
      addArtist,
      addBanner,
      addCategory,
      addInquiry,
      addNews,
      artistsInCategory,
      clearStorageError,
      data.artists,
      data.banners,
      data.categories,
      data.copy,
      data.footer,
      data.inquiries,
      data.news,
      getArtist,
      getNews,
      getCategory,
      moveBanner,
      moveCategory,
      removeArtist,
      removeBanner,
      removeCategory,
      markInquiryRead,
      removeInquiry,
      removeNews,
      resetAll,
      storageError,
      cmsConfigured,
      syncStatus,
      updateArtist,
      updateBanner,
      updateCategory,
      updateFooter,
      updateCopy,
      updateNews,
    ],
  );

  return (
    <AgencyContext.Provider value={value}>{children}</AgencyContext.Provider>
  );
}

export function useAgency() {
  const ctx = useContext(AgencyContext);
  if (!ctx) {
    throw new Error("useAgency must be used within AgencyProvider");
  }
  return ctx;
}

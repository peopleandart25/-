import type { AgencyData, Artist, Inquiry } from "../types";

export type CmsSnapshot = {
  configured: boolean;
  data: AgencyData | null;
};

async function parseSnapshot(response: Response): Promise<CmsSnapshot> {
  if (response.status === 404) {
    return { configured: false, data: null };
  }
  const payload = (await response.json()) as {
    configured?: boolean;
    data?: AgencyData | null;
  };
  return {
    configured: payload.configured !== false,
    data: payload.data ?? null,
  };
}

export async function fetchAgency(password?: string): Promise<CmsSnapshot> {
  try {
    const headers: Record<string, string> = {};
    if (password) headers["x-admin-password"] = password;
    const response = await fetch("/api/agency", {
      cache: "no-store",
      headers,
    });
    if (!response.ok) return { configured: false, data: null };
    return parseSnapshot(response);
  } catch {
    return { configured: false, data: null };
  }
}

async function uploadMedia(dataUrl: string, password: string) {
  const response = await fetch("/api/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify({ dataUrl }),
  });
  if (!response.ok) {
    throw new Error("이미지를 서버에 올리지 못했습니다.");
  }
  const payload = (await response.json()) as { url?: string };
  if (!payload.url) throw new Error("이미지를 서버에 올리지 못했습니다.");
  return payload.url;
}

async function toHostedUrl(src: string, password: string) {
  if (!src || !src.startsWith("data:")) return src;
  return uploadMedia(src, password);
}

export async function materializeImages(data: AgencyData, password: string) {
  const artists: Artist[] = [];
  for (const artist of data.artists) {
    const gallery: string[] = [];
    for (const image of artist.gallery) {
      gallery.push(await toHostedUrl(image, password));
    }
    artists.push({
      ...artist,
      profileImage: await toHostedUrl(artist.profileImage, password),
      gallery,
    });
  }

  const banners = [];
  for (const banner of data.banners) {
    banners.push({
      ...banner,
      image: await toHostedUrl(banner.image, password),
      imageMobile: await toHostedUrl(banner.imageMobile ?? "", password),
    });
  }

  const news = [];
  for (const item of data.news ?? []) {
    news.push({
      ...item,
      image: await toHostedUrl(item.image, password),
    });
  }

  return { ...data, banners, artists, news };
}

export async function saveAgency(data: AgencyData, password: string) {
  const prepared = await materializeImages(data, password);
  const response = await fetch("/api/agency", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify({ data: prepared, password }),
  });
  if (!response.ok) {
    throw new Error("사이트 저장에 실패했습니다.");
  }
  return prepared;
}

export async function postInquiry(inquiry: Inquiry) {
  const response = await fetch("/api/agency", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "inquiry", inquiry }),
  });
  return response.ok;
}

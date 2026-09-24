import { list, put } from "@vercel/blob";

const AGENCY_PATH = "cms/agency.json";
const DEFAULT_PASSWORD = "peopleart25";

function cmsPassword() {
  return process.env.CMS_SECRET || process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

function isValidPassword(password) {
  return Boolean(password) && password === cmsPassword();
}

function passwordFrom(req, body) {
  const header = req.headers["x-admin-password"];
  const fromHeader = Array.isArray(header) ? header[0] : header;
  return fromHeader || body?.password || "";
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readAgency() {
  const { blobs } = await list({ prefix: AGENCY_PATH, limit: 10 });
  const file = blobs.find((item) => item.pathname === AGENCY_PATH) ?? blobs[0];
  if (!file) return null;
  const response = await fetch(file.url, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

async function writeAgency(data) {
  await put(AGENCY_PATH, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    contentType: "application/json",
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      if (!blobConfigured()) {
        res.status(200).json({ configured: false, data: null });
        return;
      }
      const data = await readAgency();
      const authorized = isValidPassword(passwordFrom(req, {}));
      if (data && !authorized) {
        res.status(200).json({
          configured: true,
          data: { ...data, inquiries: [] },
        });
        return;
      }
      res.status(200).json({ configured: true, data });
      return;
    }

    if (req.method === "POST") {
      if (!blobConfigured()) {
        res.status(503).json({ error: "cms-not-configured" });
        return;
      }
      const body = await readJson(req);
      if (body?.type !== "inquiry" || !body.inquiry) {
        res.status(400).json({ error: "invalid-inquiry" });
        return;
      }
      const current = (await readAgency()) ?? {
        banners: [],
        categories: [],
        artists: [],
        news: [],
        inquiries: [],
        copy: {},
        footer: {},
      };
      current.inquiries = [body.inquiry, ...(current.inquiries ?? [])];
      await writeAgency(current);
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === "PUT") {
      if (!blobConfigured()) {
        res.status(503).json({ error: "cms-not-configured" });
        return;
      }
      const body = await readJson(req);
      if (!isValidPassword(passwordFrom(req, body))) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }
      if (!body?.data || typeof body.data !== "object") {
        res.status(400).json({ error: "invalid-data" });
        return;
      }
      await writeAgency(body.data);
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader("Allow", "GET, POST, PUT");
    res.status(405).json({ error: "method-not-allowed" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "cms-error";
    res.status(500).json({ error: message });
  }
}

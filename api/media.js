import { put } from "@vercel/blob";

const DEFAULT_PASSWORD = "peopleart25";

function cmsPassword() {
  return process.env.CMS_SECRET || process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

function isValidPassword(password) {
  return Boolean(password) && password === cmsPassword();
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "method-not-allowed" });
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(503).json({ error: "cms-not-configured" });
    return;
  }

  try {
    const body = await readJson(req);
    const header = req.headers["x-admin-password"];
    const password = (Array.isArray(header) ? header[0] : header) || body?.password || "";
    if (!isValidPassword(password)) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    const dataUrl = typeof body?.dataUrl === "string" ? body.dataUrl : "";
    const match = /^data:(image\/[\w.+-]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      res.status(400).json({ error: "invalid-image" });
      return;
    }

    const mime = match[1];
    const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
    const buffer = Buffer.from(match[2], "base64");
    const blob = await put(`cms/media/${Date.now()}-${crypto.randomUUID()}.${ext}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: mime,
    });
    res.status(200).json({ url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload-error";
    res.status(500).json({ error: message });
  }
}

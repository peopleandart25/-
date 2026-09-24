const SESSION_KEY = "pa-entertainment-admin-session";
const PASSWORD_KEY = "pa-entertainment-admin-password";

export const ADMIN_ID = "admin";
export const DEFAULT_ADMIN_PASSWORD = "peopleart25";

export function getAdminPassword() {
  try {
    const stored = localStorage.getItem(PASSWORD_KEY);
    if (stored && stored.length > 0) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_ADMIN_PASSWORD;
}

export function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function loginAdmin(id: string, password: string) {
  if (id.trim() === ADMIN_ID && password === getAdminPassword()) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function changeAdminPassword(current: string, next: string) {
  if (current !== getAdminPassword()) {
    return { ok: false, message: "현재 비밀번호가 올바르지 않습니다." };
  }
  if (next.trim().length < 6) {
    return { ok: false, message: "새 비밀번호는 6자 이상이어야 합니다." };
  }
  if (next === current) {
    return { ok: false, message: "현재 비밀번호와 다른 비밀번호를 입력해 주세요." };
  }
  try {
    localStorage.setItem(PASSWORD_KEY, next);
    return { ok: true, message: "비밀번호가 변경되었습니다." };
  } catch {
    return { ok: false, message: "비밀번호를 저장하지 못했습니다. 다시 시도해 주세요." };
  }
}

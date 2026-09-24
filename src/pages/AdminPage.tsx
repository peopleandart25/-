import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAgency } from "../context/AgencyContext";
import {
  isAdminLoggedIn,
  loginAdmin,
  logoutAdmin,
} from "../lib/adminAuth";
import { AboutManager } from "./admin/AboutManager";
import { ArtistManager } from "./admin/ArtistManager";
import { BannerManager } from "./admin/BannerManager";
import { CategoryManager } from "./admin/CategoryManager";
import { FooterManager } from "./admin/FooterManager";
import { InquiryManager } from "./admin/InquiryManager";
import { NewsManager } from "./admin/NewsManager";
import { PasswordManager } from "./admin/PasswordManager";

const TABS = [
  { id: "inquiries", label: "문의" },
  { id: "footer", label: "Footer 정보" },
  { id: "about", label: "About 페이지" },
  { id: "banners", label: "메인 배너" },
  { id: "artists", label: "아티스트" },
  { id: "news", label: "뉴스 게시판" },
  { id: "password", label: "비밀번호" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const fieldClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-lg text-charcoal outline-none focus:border-orange";

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (loginAdmin(id, password)) {
      setError("");
      onSuccess();
      return;
    }
    setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    setPassword("");
  };

  return (
    <main id="main" className="admin-ui min-h-dvh bg-white pt-24 pb-28 md:pt-44 md:pb-24">
      <div className="editorial-grid max-w-xl">
        <p className="font-mono text-base tracking-[0.22em] text-orange">
          ADMIN
        </p>
        <h1 className="mt-3 font-display text-4xl text-charcoal md:text-6xl">
          로그인
        </h1>
        <p className="mt-4 text-base text-black md:text-lg">
          사이트 운영 페이지는 로그인이 필요합니다.
        </p>

        <form onSubmit={onSubmit} className="mt-12 space-y-8">
          <label className="block">
            <span className="font-mono text-sm tracking-[0.18em] text-black">
              아이디
            </span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={id}
              onChange={(event) => setId(event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="font-mono text-sm tracking-[0.18em] text-black">
              비밀번호
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldClass}
            />
          </label>
          {error ? (
            <p className="text-lg text-orange" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="bg-orange px-8 py-3.5 font-mono text-base tracking-[0.2em] text-charcoal hover:bg-orange-deep md:py-3 md:text-xl"
          >
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}

export function AdminPage() {
  const {
    storageError,
    clearStorageError,
    resetAll,
    inquiries,
    cmsConfigured,
    syncStatus,
  } = useAgency();
  const [tab, setTab] = useState<TabId>("inquiries");
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn);

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <main id="main" className="admin-ui min-h-dvh bg-white pt-24 pb-28 md:pt-44 md:pb-24">
      <div className="editorial-grid">
        <p className="font-mono text-base tracking-[0.22em] text-orange">
          ADMIN
        </p>
        <h1 className="mt-3 font-display text-4xl text-charcoal md:text-6xl">
          사이트 운영
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black md:text-lg">
          Footer, About, 배너, 아티스트, 뉴스, 문의를 수정합니다. 저장하면
          사이트 서버에 올라가서 PC와 휴대폰에서 같이 보입니다.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-black">
          {syncStatus === "loading"
            ? "사이트 데이터를 불러오는 중입니다."
            : cmsConfigured && syncStatus === "remote"
              ? "지금 이 내용은 사이트 전체에 공유됩니다. 휴대폰에서 새로고침하면 같은 배너·아티스트가 보입니다."
              : "아직 서버 저장이 연결되지 않아 이 컴퓨터 브라우저에만 저장됩니다. Vercel Storage에서 Blob을 만든 뒤 이 프로젝트에 연결하고 다시 배포해야 휴대폰에도 반영됩니다."}
        </p>

        <div className="mt-6 flex flex-wrap gap-5">
          <Link
            to="/"
            className="font-mono text-base tracking-[0.18em] text-orange hover:text-orange-deep"
          >
            홈으로 보기
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("모든 관리 데이터를 기본값으로 되돌릴까요?")) {
                resetAll();
              }
            }}
            className="font-mono text-base tracking-[0.18em] text-orange hover:text-orange-deep"
          >
            기본값으로 되돌리기
          </button>
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              setLoggedIn(false);
            }}
            className="font-mono text-base tracking-[0.18em] text-orange hover:text-orange-deep"
          >
            로그아웃
          </button>
        </div>

        {storageError ? (
          <div
            className="mt-8 flex flex-wrap items-center justify-between gap-3 border border-orange/40 px-4 py-3 text-lg text-orange"
            role="alert"
          >
            <p>{storageError}</p>
            <button
              type="button"
              onClick={clearStorageError}
              className="font-mono text-sm tracking-[0.16em]"
            >
              닫기
            </button>
          </div>
        ) : null}

        <div
          className="-mx-4 mt-12 flex gap-1 overflow-x-auto border-b border-charcoal/10 px-4 md:mx-0 md:flex-wrap md:gap-2 md:overflow-visible md:px-0"
          role="tablist"
          aria-label="관리 메뉴"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`shrink-0 px-3 py-3 font-mono text-sm tracking-[0.16em] transition-colors duration-300 md:px-4 md:text-lg md:tracking-[0.18em] ${
                tab === item.id
                  ? "border-b-2 border-orange text-black"
                  : "text-black hover:text-orange"
              }`}
            >
              {item.id === "inquiries" &&
              inquiries.some((entry) => !entry.read)
                ? `문의 (${inquiries.filter((entry) => !entry.read).length})`
                : item.label}
            </button>
          ))}
        </div>

        <div className="mt-10" role="tabpanel">
          {tab === "inquiries" ? <InquiryManager /> : null}
          {tab === "footer" ? <FooterManager /> : null}
          {tab === "about" ? <AboutManager /> : null}
          {tab === "banners" ? <BannerManager /> : null}
          {tab === "artists" ? (
            <div className="space-y-16">
              <CategoryManager />
              <ArtistManager />
            </div>
          ) : null}
          {tab === "news" ? <NewsManager /> : null}
          {tab === "password" ? <PasswordManager /> : null}
        </div>
      </div>
    </main>
  );
}

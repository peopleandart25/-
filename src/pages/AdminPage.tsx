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
    <main id="main" className="min-h-dvh bg-white pt-24 pb-20 md:pt-44 md:pb-24">
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
  const { storageError, clearStorageError, resetAll, inquiries } = useAgency();
  const [tab, setTab] = useState<TabId>("inquiries");
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn);

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <main id="main" className="min-h-dvh bg-white pt-24 pb-20 md:pt-44 md:pb-24">
      <div className="editorial-grid">
        <p className="font-mono text-base tracking-[0.22em] text-orange">
          ADMIN
        </p>
        <h1 className="mt-3 font-display text-4xl text-charcoal md:text-6xl">
          사이트 운영
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black md:text-lg">
          Footer, About, 배너, 아티스트, 뉴스, 문의를 이 브라우저에 저장합니다.
          새로고침 후에도 유지되며, 공개 페이지에 바로 반영됩니다.
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
          className="mt-12 flex flex-wrap gap-2 border-b border-charcoal/10"
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
              className={`px-4 py-3 font-mono text-base tracking-[0.18em] transition-colors duration-300 md:text-lg ${
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

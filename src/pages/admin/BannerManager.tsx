import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { FileImageButton } from "../../components/FileImageButton";
import { BANNER_CROP } from "../../components/ImageAdjustModal";
import { useAgency } from "../../context/AgencyContext";

export function BannerManager() {
  const {
    banners,
    copy,
    updateCopy,
    addBanner,
    updateBanner,
    removeBanner,
    moveBanner,
  } = useAgency();
  const [homeSlogan, setHomeSlogan] = useState(copy.homeSlogan);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setHomeSlogan(copy.homeSlogan);
  }, [copy.homeSlogan]);

  const onAdd = (image: string) => {
    addBanner({ image, title: "", subtitle: "" });
  };

  const onSaveSlogan = (event: FormEvent) => {
    event.preventDefault();
    const ok = updateCopy({ homeSlogan: homeSlogan.trim() });
    if (ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <section>
      <form
        onSubmit={onSaveSlogan}
        className="mb-12 border-b border-charcoal/10 pb-10"
      >
        <h2 className="font-display text-2xl text-charcoal">홈 화면 슬로건</h2>
        <p className="mt-2 max-w-xl text-sm text-black">
          메인 배너 왼쪽 아래의 YOUR MOMENT, OUR VISION. 문구입니다. 모든 슬라이드에
          같이 표시됩니다.
        </p>
        <label className="mt-6 block max-w-2xl">
          <span className="font-mono text-[10px] tracking-[0.18em] text-black">
            슬로건
          </span>
          <input
            value={homeSlogan}
            onChange={(event) => setHomeSlogan(event.target.value)}
            className="mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-lg text-charcoal outline-none focus:border-orange"
          />
        </label>
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            className="bg-orange px-8 py-3 font-mono text-xl tracking-[0.2em] text-charcoal hover:bg-orange-deep"
          >
            저장하기
          </button>
          {saved ? (
            <p className="text-lg text-orange" role="status">
              메인 페이지에 반영되었습니다.
            </p>
          ) : null}
        </div>
      </form>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">메인 배너 관리</h2>
          <p className="mt-2 max-w-xl text-sm text-black">
            홈 화면 풀스크린 슬라이더에 들어갈 이미지를 추가하고 순서를 바꿉니다.
            이미지는 이 브라우저에 저장됩니다.
          </p>
          <p className="mt-3 font-mono text-sm tracking-[0.08em] text-orange">
            권장 사이즈 1920 × 1080 px (16:9 가로)
          </p>
          <p className="mt-1 max-w-xl text-sm text-black">
            업로드하면 16:9 미리보기가 열립니다. 드래그와 확대로 실제 홈 화면
            구도를 맞춘 뒤 적용하세요.
          </p>
        </div>
        <FileImageButton
          label="배너 이미지 추가"
          maxEdge={1920}
          quality={0.78}
          crop={BANNER_CROP}
          onLoaded={onAdd}
        />
      </div>

      {banners.length === 0 ? (
        <p className="mt-10 text-sm text-black">등록된 배너가 없습니다.</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {banners.map((banner, index) => (
            <li
              key={banner.id}
              className="grid gap-4 border border-charcoal/10 p-3 md:grid-cols-[160px_1fr_auto] md:items-start"
            >
              <div className="aspect-video overflow-hidden bg-charcoal md:aspect-[16/10]">
                <img
                  src={banner.image}
                  alt={banner.title || `배너 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-black">
                    TITLE
                  </span>
                  <input
                    value={banner.title}
                    onChange={(event) =>
                      updateBanner(banner.id, { title: event.target.value })
                    }
                    className="mt-1 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-black">
                    SUBTITLE
                  </span>
                  <input
                    value={banner.subtitle}
                    onChange={(event) =>
                      updateBanner(banner.id, { subtitle: event.target.value })
                    }
                    className="mt-1 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
                  />
                </label>
                <FileImageButton
                  label="이미지 교체"
                  compact
                  maxEdge={1920}
                  quality={0.78}
                  crop={BANNER_CROP}
                  onLoaded={(image) => updateBanner(banner.id, { image })}
                />
              </div>
              <div className="flex gap-2 md:flex-col">
                <button
                  type="button"
                  aria-label="위로"
                  disabled={index === 0}
                  onClick={() => moveBanner(banner.id, "up")}
                  className="flex h-9 w-9 items-center justify-center text-black hover:text-orange disabled:opacity-25"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  aria-label="아래로"
                  disabled={index === banners.length - 1}
                  onClick={() => moveBanner(banner.id, "down")}
                  className="flex h-9 w-9 items-center justify-center text-black hover:text-orange disabled:opacity-25"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() => {
                    if (window.confirm("이 배너를 삭제할까요?")) {
                      removeBanner(banner.id);
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center text-black hover:text-orange"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

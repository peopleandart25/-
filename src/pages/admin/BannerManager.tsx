import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { FileImageButton } from "../../components/FileImageButton";
import {
  AdjustImageButton,
  BANNER_CROP,
  BANNER_MOBILE_CROP,
} from "../../components/ImageAdjustModal";
import { useAgency } from "../../context/AgencyContext";

function DevicePreview({
  label,
  src,
  variant,
}: {
  label: string;
  src: string;
  variant: "pc" | "mobile";
}) {
  if (variant === "pc") {
    return (
      <div>
        <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-black">
          {label}
        </p>
        <div className="overflow-hidden border border-charcoal/15">
          <div className="flex h-6 items-center gap-1 bg-charcoal px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="ml-1 font-mono text-[8px] tracking-[0.12em] text-white/40">
              PC
            </span>
          </div>
          <div className="aspect-video overflow-hidden bg-charcoal">
            {src ? (
              <img src={src} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-[10px] tracking-[0.14em] text-white/50">
                NO IMAGE
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-black">
        {label}
      </p>
      <div className="w-[108px] rounded-[1.35rem] border-[7px] border-charcoal bg-charcoal p-0.5">
        <div className="mx-auto mb-0.5 h-2.5 w-8 rounded-full bg-black/40" />
        <div className="aspect-[9/19.5] overflow-hidden bg-charcoal">
          {src ? (
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-[8px] tracking-[0.12em] text-white/50">
              NO IMAGE
            </div>
          )}
        </div>
        <div className="mx-auto mt-0.5 h-0.5 w-6 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

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
            PC용과 모바일용 이미지를 따로 올립니다. 각 화면에 맞는 비율로 자른 뒤
            미리보기에서 확인할 수 있습니다.
          </p>
          <p className="mt-3 font-mono text-sm tracking-[0.08em] text-orange">
            PC 1920 × 1080 px (16:9 가로)
          </p>
          <p className="mt-1 font-mono text-sm tracking-[0.08em] text-orange">
            모바일 1080 × 2340 px (세로 풀화면)
          </p>
        </div>
        <button
          type="button"
          onClick={() => addBanner()}
          className="inline-flex min-h-11 items-center gap-2 bg-orange px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] text-charcoal hover:bg-orange-deep"
        >
          <Plus size={14} />
          배너 추가
        </button>
      </div>

      {banners.length === 0 ? (
        <p className="mt-10 text-sm text-black">등록된 배너가 없습니다.</p>
      ) : (
        <ul className="mt-10 space-y-6">
          {banners.map((banner, index) => (
            <li key={banner.id} className="border border-charcoal/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-wrap items-start gap-6">
                  <DevicePreview
                    label="PC 미리보기"
                    src={banner.image}
                    variant="pc"
                  />
                  <DevicePreview
                    label="모바일 미리보기"
                    src={banner.imageMobile}
                    variant="mobile"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="위로"
                    disabled={index === 0}
                    onClick={() => moveBanner(banner.id, "up")}
                    className="flex h-11 w-11 items-center justify-center text-black hover:text-orange disabled:opacity-25"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="아래로"
                    disabled={index === banners.length - 1}
                    onClick={() => moveBanner(banner.id, "down")}
                    className="flex h-11 w-11 items-center justify-center text-black hover:text-orange disabled:opacity-25"
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
                    className="flex h-11 w-11 items-center justify-center text-black hover:text-orange"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-black">
                    PC 이미지
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <FileImageButton
                      label={banner.image ? "PC 이미지 교체" : "PC 이미지 업로드"}
                      compact
                      maxEdge={1920}
                      quality={0.78}
                      crop={BANNER_CROP}
                      onLoaded={(image) => updateBanner(banner.id, { image })}
                    />
                    {banner.image ? (
                      <AdjustImageButton
                        src={banner.image}
                        spec={BANNER_CROP}
                        compact
                        onSaved={(image) => updateBanner(banner.id, { image })}
                      />
                    ) : null}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-black">
                    모바일 이미지
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <FileImageButton
                      label={
                        banner.imageMobile
                          ? "모바일 이미지 교체"
                          : "모바일 이미지 업로드"
                      }
                      compact
                      maxEdge={2340}
                      quality={0.78}
                      crop={BANNER_MOBILE_CROP}
                      onLoaded={(imageMobile) =>
                        updateBanner(banner.id, { imageMobile })
                      }
                    />
                    {banner.imageMobile ? (
                      <AdjustImageButton
                        src={banner.imageMobile}
                        spec={BANNER_MOBILE_CROP}
                        compact
                        onSaved={(imageMobile) =>
                          updateBanner(banner.id, { imageMobile })
                        }
                      />
                    ) : null}
                  </div>
                </div>
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

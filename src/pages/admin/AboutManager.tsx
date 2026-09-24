import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAgency } from "../../context/AgencyContext";
import type { SiteCopy } from "../../types";

const fieldClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-lg text-charcoal outline-none focus:border-orange";

const areaClass =
  "mt-2 w-full resize-y border border-charcoal/15 bg-transparent px-3 py-3 text-lg leading-relaxed text-charcoal outline-none focus:border-orange";

export function AboutManager() {
  const { copy, updateCopy } = useAgency();
  const [form, setForm] = useState<SiteCopy>(copy);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(copy);
  }, [copy]);

  const setField =
    (key: keyof SiteCopy) =>
    (event: { target: { value: string } }) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = updateCopy({
      kicker: form.kicker.trim(),
      headline: form.headline.trim(),
      slogan: form.slogan.trim(),
      visionLabel: form.visionLabel.trim(),
      vision: form.vision.trim(),
      aboutIntro: form.aboutIntro.trim(),
      aboutSupport: form.aboutSupport.trim(),
    });
    if (ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <section>
      <h2 className="font-display text-3xl text-charcoal">About 페이지 관리</h2>
      <p className="mt-2 max-w-xl text-lg text-black">
        About 페이지의 제목, 슬로건, 비전, 소개 문구를 수정합니다. 저장하면
        공개 About 페이지에 바로 반영됩니다.
      </p>
      <Link
        to="/about"
        className="mt-3 inline-block font-mono text-base tracking-[0.18em] text-black hover:text-orange"
      >
        About 페이지 보기
      </Link>

      <form onSubmit={onSubmit} className="mt-10 grid gap-6 md:grid-cols-2">
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            상단 라벨
          </span>
          <input
            value={form.kicker}
            onChange={setField("kicker")}
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            슬로건
          </span>
          <input
            value={form.slogan}
            onChange={setField("slogan")}
            className={fieldClass}
          />
        </label>
        <label className="md:col-span-2">
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            메인 타이틀
          </span>
          <textarea
            rows={2}
            value={form.headline}
            onChange={setField("headline")}
            className={areaClass}
          />
          <span className="mt-2 block text-base text-black">
            줄바꿈하면 About 페이지에서도 줄이 나뉩니다.
          </span>
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            비전 라벨
          </span>
          <input
            value={form.visionLabel}
            onChange={setField("visionLabel")}
            className={fieldClass}
          />
        </label>
        <label className="md:col-span-2">
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            비전 문구
          </span>
          <textarea
            rows={3}
            value={form.vision}
            onChange={setField("vision")}
            className={areaClass}
          />
        </label>
        <label className="md:col-span-2">
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            소개 문단 1
          </span>
          <textarea
            rows={4}
            value={form.aboutIntro}
            onChange={setField("aboutIntro")}
            className={areaClass}
          />
        </label>
        <label className="md:col-span-2">
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            소개 문단 2
          </span>
          <textarea
            rows={4}
            value={form.aboutSupport}
            onChange={setField("aboutSupport")}
            className={areaClass}
          />
        </label>
        <div className="flex items-center gap-4 md:col-span-2">
          <button
            type="submit"
            className="bg-orange px-8 py-3 font-mono text-xl tracking-[0.2em] text-charcoal hover:bg-orange-deep"
          >
            저장하기
          </button>
          {saved ? (
            <p className="text-lg text-orange" role="status">
              About 페이지에 반영되었습니다.
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

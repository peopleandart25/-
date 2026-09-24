import { useEffect, useState, type FormEvent } from "react";
import { useAgency } from "../../context/AgencyContext";
import type { FooterInfo } from "../../types";

const fieldClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-lg text-charcoal outline-none focus:border-orange";

export function FooterManager() {
  const { footer, updateFooter } = useAgency();
  const [form, setForm] = useState<FooterInfo>(footer);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(footer);
  }, [footer]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = updateFooter({
      blurb: form.blurb.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      instagram: form.instagram.trim(),
      instagramHandle: form.instagramHandle.trim(),
      youtube: form.youtube.trim(),
      youtubeHandle: form.youtubeHandle.trim(),
    });
    if (ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <section>
      <h2 className="font-display text-3xl text-charcoal">Footer 정보 관리</h2>
      <p className="mt-2 max-w-xl text-lg text-black">
        하단 VISIT, CONTACT, FOLLOW 정보를 수정합니다. 저장하면 홈페이지
        Footer에 바로 반영됩니다. 소개 텍스트는 보관만 되며 사이트에는 표시되지
        않습니다.
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-6 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            소개 텍스트
          </span>
          <textarea
            rows={4}
            value={form.blurb}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, blurb: event.target.value }))
            }
            className="mt-2 w-full resize-y border border-charcoal/15 bg-transparent px-3 py-3 text-lg leading-relaxed text-charcoal outline-none focus:border-orange"
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            VISIT 주소
          </span>
          <input
            value={form.address}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, address: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            CONTACT 이메일
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            CONTACT 전화번호
          </span>
          <input
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            Instagram URL
          </span>
          <input
            value={form.instagram}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, instagram: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            Instagram 표시명
          </span>
          <input
            value={form.instagramHandle}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                instagramHandle: event.target.value,
              }))
            }
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            YouTube URL
          </span>
          <input
            value={form.youtube}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, youtube: event.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label>
          <span className="font-mono text-sm tracking-[0.18em] text-black">
            YouTube 표시명
          </span>
          <input
            value={form.youtubeHandle}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                youtubeHandle: event.target.value,
              }))
            }
            className={fieldClass}
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
              Footer에 반영되었습니다.
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

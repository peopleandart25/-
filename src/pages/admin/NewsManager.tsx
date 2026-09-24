import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FileImageButton } from "../../components/FileImageButton";
import { useAgency } from "../../context/AgencyContext";
import type { NewsItem } from "../../types";

const emptyForm = {
  title: "",
  date: "",
  excerpt: "",
  body: "",
  image: "",
};

export function NewsManager() {
  const { news, addNews, updateNews, removeNews } = useAgency();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    });
    setFormOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.date,
      excerpt: item.excerpt,
      body: item.body,
      image: item.image,
    });
    setFormOpen(true);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const payload = {
      title: form.title,
      date: form.date,
      excerpt: form.excerpt || form.body.slice(0, 80),
      body: form.body,
      image: form.image,
    };
    const ok = editingId ? updateNews(editingId, payload) : addNews(payload);
    if (ok) {
      setFormOpen(false);
      setEditingId(null);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-charcoal">뉴스 게시판 관리</h2>
          <p className="mt-2 max-w-xl text-lg text-black">
            NEWS 페이지에 노출될 소식을 등록합니다. 썸네일 이미지는 이 브라우저에
            Base64로 저장됩니다.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-orange px-5 py-2.5 font-mono text-base tracking-[0.18em] text-charcoal hover:bg-orange-deep"
        >
          <Plus size={14} />
          소식 추가
        </button>
      </div>

      {formOpen ? (
        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 border border-charcoal/10 p-5"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="font-mono text-sm tracking-[0.18em] text-black">
                제목
              </span>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-lg text-charcoal outline-none focus:border-orange"
                required
              />
            </label>
            <label>
              <span className="font-mono text-sm tracking-[0.18em] text-black">
                날짜
              </span>
              <input
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
                placeholder="2026.09.12"
                className="mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-lg text-charcoal outline-none focus:border-orange"
              />
            </label>
          </div>
          <div>
            <p className="font-mono text-sm tracking-[0.18em] text-black">
              썸네일 이미지
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-4">
              {form.image ? (
                <div className="h-28 w-44 overflow-hidden bg-charcoal">
                  <img
                    src={form.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-28 w-44 items-center justify-center bg-charcoal font-mono text-sm text-white">
                  NO IMAGE
                </div>
              )}
              <FileImageButton
                label="이미지 업로드"
                maxEdge={1400}
                quality={0.8}
                onLoaded={(image) => setForm((prev) => ({ ...prev, image }))}
              />
            </div>
          </div>
          <label className="block">
            <span className="font-mono text-sm tracking-[0.18em] text-black">
              요약
            </span>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, excerpt: event.target.value }))
              }
              className="mt-2 w-full resize-y border border-charcoal/15 bg-transparent px-3 py-3 text-lg text-charcoal outline-none focus:border-orange"
            />
          </label>
          <label className="block">
            <span className="font-mono text-sm tracking-[0.18em] text-black">
              본문
            </span>
            <textarea
              rows={6}
              value={form.body}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, body: event.target.value }))
              }
              className="mt-2 w-full resize-y border border-charcoal/15 bg-transparent px-3 py-3 text-lg leading-relaxed text-charcoal outline-none focus:border-orange"
              required
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="bg-orange px-8 py-3 font-mono text-xl tracking-[0.2em] text-charcoal hover:bg-orange-deep"
            >
              {editingId ? "수정 저장" : "등록"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="font-mono text-base tracking-[0.16em] text-black hover:text-charcoal"
            >
              취소
            </button>
          </div>
        </form>
      ) : null}

      {news.length === 0 ? (
        <p className="mt-10 text-lg text-black">등록된 소식이 없습니다.</p>
      ) : (
        <ul className="mt-10 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {news.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 py-5 md:flex-row md:items-center"
            >
              {item.image ? (
                <div className="h-20 w-32 shrink-0 overflow-hidden bg-charcoal">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm tracking-[0.16em] text-black">
                  {item.date}
                </p>
                <p className="mt-1 font-display text-2xl text-charcoal">
                  {item.title}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="수정"
                  onClick={() => openEdit(item)}
                  className="flex h-10 w-10 items-center justify-center text-black hover:text-orange"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() => {
                    if (window.confirm("이 소식을 삭제할까요?")) {
                      removeNews(item.id);
                    }
                  }}
                  className="flex h-10 w-10 items-center justify-center text-black hover:text-orange"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

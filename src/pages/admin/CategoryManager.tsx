import { useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useAgency } from "../../context/AgencyContext";

export function CategoryManager() {
  const {
    categories,
    addCategory,
    updateCategory,
    removeCategory,
    moveCategory,
    artistsInCategory,
  } = useAgency();
  const [nameKo, setNameKo] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setNameKo("");
    setNameEn("");
    setSlug("");
    setEditingId(null);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!nameKo.trim() && !nameEn.trim()) return;
    if (editingId) {
      updateCategory(editingId, { nameKo, nameEn });
    } else {
      addCategory({ nameKo, nameEn, id: slug });
    }
    resetForm();
  };

  return (
    <section>
      <h2 className="font-display text-2xl text-charcoal">아티스트 카테고리 관리</h2>
      <p className="mt-2 max-w-xl text-sm text-black">
        ARTISTS 드롭다운에 표시될 폴더를 만들고 순서를 바꿉니다. 폴더를 삭제하면
        그 안의 아티스트도 함께 삭제됩니다.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-4 border border-charcoal/10 p-5 md:grid-cols-3"
      >
        <label>
          <span className="font-mono text-[10px] tracking-[0.18em] text-black">
            한글명
          </span>
          <input
            value={nameKo}
            onChange={(event) => setNameKo(event.target.value)}
            placeholder="배우"
            className="mt-1 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
          />
        </label>
        <label>
          <span className="font-mono text-[10px] tracking-[0.18em] text-black">
            영문명
          </span>
          <input
            value={nameEn}
            onChange={(event) => setNameEn(event.target.value)}
            placeholder="ACTOR"
            className="mt-1 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
          />
        </label>
        <label>
          <span className="font-mono text-[10px] tracking-[0.18em] text-black">
            URL 슬러그
          </span>
          <input
            value={editingId ? editingId : slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="actor"
            disabled={Boolean(editingId)}
            className="mt-1 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange disabled:opacity-40"
          />
        </label>
        <div className="flex items-center gap-4 md:col-span-3">
          <button
            type="submit"
            className="bg-orange px-6 py-2.5 font-mono text-[11px] tracking-[0.2em] text-charcoal hover:bg-orange-deep"
          >
            {editingId ? "폴더 수정" : "폴더 추가"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-[11px] tracking-[0.16em] text-black hover:text-charcoal"
            >
              취소
            </button>
          ) : null}
        </div>
      </form>

      <ul className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/10">
        {categories.map((folder, index) => (
          <li
            key={folder.id}
            className="flex flex-wrap items-center justify-between gap-3 py-4"
          >
            <div>
              <p className="font-display text-xl text-charcoal">{folder.nameKo}</p>
              <p className="font-mono text-[11px] tracking-[0.16em] text-black">
                {folder.nameEn} · /artists/{folder.id} ·{" "}
                {artistsInCategory(folder.id).length}명
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="위로"
                disabled={index === 0}
                onClick={() => moveCategory(folder.id, "up")}
                className="flex h-9 w-9 items-center justify-center text-black hover:text-orange disabled:opacity-25"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                aria-label="아래로"
                disabled={index === categories.length - 1}
                onClick={() => moveCategory(folder.id, "down")}
                className="flex h-9 w-9 items-center justify-center text-black hover:text-orange disabled:opacity-25"
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                aria-label="수정"
                onClick={() => {
                  setEditingId(folder.id);
                  setNameKo(folder.nameKo);
                  setNameEn(folder.nameEn);
                  setSlug(folder.id);
                }}
                className="flex h-9 w-9 items-center justify-center text-black hover:text-orange"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                aria-label="삭제"
                onClick={() => {
                  const count = artistsInCategory(folder.id).length;
                  const extra =
                    count > 0
                      ? ` 이 폴더의 아티스트 ${count}명도 삭제됩니다.`
                      : "";
                  if (window.confirm(`‘${folder.nameKo}’ 폴더를 삭제할까요?${extra}`)) {
                    if (editingId === folder.id) resetForm();
                    removeCategory(folder.id);
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
    </section>
  );
}

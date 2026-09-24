import { useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FileImageButton } from "../../components/FileImageButton";
import { GALLERY_CROP, PROFILE_CROP } from "../../components/ImageAdjustModal";
import { useAgency } from "../../context/AgencyContext";
import type { Artist } from "../../types";

const emptyForm = {
  categoryId: "",
  name: "",
  englishName: "",
  profileImage: "",
  career: "",
  gallery: [] as string[],
};

export function ArtistManager() {
  const {
    categories,
    addArtist,
    updateArtist,
    removeArtist,
    artistsInCategory,
  } = useAgency();
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const activeCategory = categoryId || categories[0]?.id || "";
  const list = useMemo(
    () => (activeCategory ? artistsInCategory(activeCategory) : []),
    [activeCategory, artistsInCategory],
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: activeCategory });
    setFormOpen(true);
  };

  const openEdit = (artist: Artist) => {
    setEditingId(artist.id);
    setForm({
      categoryId: artist.categoryId,
      name: artist.name,
      englishName: artist.englishName,
      profileImage: artist.profileImage,
      career: artist.career,
      gallery: [...artist.gallery],
    });
    setFormOpen(true);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.categoryId) return;
    const payload = {
      categoryId: form.categoryId,
      name: form.name,
      englishName: form.englishName,
      profileImage: form.profileImage,
      career: form.career,
      gallery: form.gallery,
    };
    const ok = editingId
      ? updateArtist(editingId, payload)
      : addArtist(payload);
    if (ok) {
      setFormOpen(false);
      setEditingId(null);
      setCategoryId(form.categoryId);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">아티스트 프로필 관리</h2>
          <p className="mt-2 max-w-xl text-sm text-black">
            카테고리를 고른 뒤 아티스트를 추가하거나 수정합니다. 프로필·갤러리
            이미지는 파일 업로드 후 이 브라우저에 저장됩니다.
          </p>
          <p className="mt-3 font-mono text-sm tracking-[0.08em] text-orange">
            프로필 900 × 1200 px (3:4 세로)
          </p>
          <p className="mt-1 font-mono text-sm tracking-[0.08em] text-orange">
            갤러리 1080 × 1350 px (4:5 세로)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={!activeCategory}
          className="inline-flex items-center gap-2 bg-orange px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] text-charcoal hover:bg-orange-deep disabled:opacity-40"
        >
          <Plus size={14} />
          아티스트 추가
        </button>
      </div>

      <label className="mt-8 block max-w-xs">
        <span className="font-mono text-[10px] tracking-[0.18em] text-black">
          카테고리
        </span>
        <select
          value={activeCategory}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setFormOpen(false);
          }}
          className="mt-2 w-full appearance-none border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
        >
          {categories.length === 0 ? (
            <option value="" className="bg-charcoal">
              먼저 카테고리를 만들어 주세요
            </option>
          ) : (
            categories.map((folder) => (
              <option key={folder.id} value={folder.id} className="bg-charcoal">
                {folder.nameKo} ({folder.nameEn})
              </option>
            ))
          )}
        </select>
      </label>

      {list.length === 0 ? (
        <p className="mt-10 text-sm text-black">
          이 카테고리에 등록된 아티스트가 없습니다.
        </p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {list.map((artist) => (
            <li
              key={artist.id}
              className="flex items-center gap-4 border border-charcoal/10 p-3"
            >
              <div className="h-16 w-12 shrink-0 overflow-hidden bg-charcoal">
                {artist.profileImage ? (
                  <img
                    src={artist.profileImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl text-charcoal">
                  {artist.name}
                </p>
                <p className="font-mono text-[11px] tracking-[0.16em] text-black">
                  {artist.englishName}
                </p>
              </div>
              <button
                type="button"
                aria-label="수정"
                onClick={() => openEdit(artist)}
                className="flex h-9 w-9 items-center justify-center text-black hover:text-orange"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                aria-label="삭제"
                onClick={() => {
                  if (window.confirm(`${artist.name} 프로필을 삭제할까요?`)) {
                    if (editingId === artist.id) setFormOpen(false);
                    removeArtist(artist.id);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center text-black hover:text-orange"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-6 border border-charcoal/10 p-5 md:p-8"
        >
          <p className="font-mono text-[11px] tracking-[0.2em] text-orange">
            {editingId ? "EDIT PROFILE" : "NEW PROFILE"}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <label>
              <span className="font-mono text-[10px] tracking-[0.18em] text-black">
                카테고리
              </span>
              <select
                value={form.categoryId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                className="mt-2 w-full appearance-none border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
              >
                {categories.map((folder) => (
                  <option
                    key={folder.id}
                    value={folder.id}
                    className="bg-charcoal"
                  >
                    {folder.nameKo}
                  </option>
                ))}
              </select>
            </label>
            <div />
            <label>
              <span className="font-mono text-[10px] tracking-[0.18em] text-black">
                한글 이름
              </span>
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
              />
            </label>
            <label>
              <span className="font-mono text-[10px] tracking-[0.18em] text-black">
                영문 이름
              </span>
              <input
                value={form.englishName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    englishName: event.target.value,
                  }))
                }
                className="mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none focus:border-orange"
              />
            </label>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-black">
              프로필 이미지
            </p>
            <p className="mt-1 text-sm text-black">
              권장 사이즈 900 × 1200 px (3:4 세로). 업로드 후 미리보기에서 얼굴
              위치를 맞출 수 있습니다.
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-4">
              {form.profileImage ? (
                <div className="h-40 w-28 overflow-hidden bg-charcoal">
                  <img
                    src={form.profileImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-40 w-28 items-center justify-center bg-charcoal font-mono text-[10px] tracking-[0.18em] text-white">
                  NO IMAGE
                </div>
              )}
              <FileImageButton
                label="프로필 업로드"
                crop={PROFILE_CROP}
                maxEdge={1600}
                onLoaded={(profileImage) =>
                  setForm((prev) => ({ ...prev, profileImage }))
                }
              />
            </div>
          </div>

          <label className="block">
            <span className="font-mono text-[10px] tracking-[0.18em] text-black">
              상세 경력사항
            </span>
            <textarea
              rows={8}
              value={form.career}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, career: event.target.value }))
              }
              className="mt-2 w-full resize-y border border-charcoal/15 bg-transparent px-3 py-3 text-sm leading-relaxed text-charcoal outline-none focus:border-orange"
            />
          </label>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] tracking-[0.18em] text-black">
                  갤러리 이미지
                </p>
                <p className="mt-1 text-sm text-black">
                  권장 사이즈 1080 × 1350 px (4:5 세로). 업로드 후 미리보기에서
                  구도를 조절하세요.
                </p>
              </div>
              <FileImageButton
                label="갤러리 추가"
                compact
                maxEdge={1600}
                quality={0.78}
                crop={GALLERY_CROP}
                onLoaded={(image) =>
                  setForm((prev) => ({
                    ...prev,
                    gallery: [...prev.gallery, image],
                  }))
                }
              />
            </div>
            {form.gallery.length === 0 ? (
              <p className="mt-3 text-sm text-black">아직 갤러리 이미지가 없습니다.</p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {form.gallery.map((image, index) => (
                  <li key={`${index}-${image.slice(0, 24)}`} className="relative">
                    <div className="aspect-[4/5] overflow-hidden bg-charcoal">
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute right-2 top-2 bg-white/80 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-charcoal hover:text-orange"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="bg-orange px-8 py-3 font-mono text-[11px] tracking-[0.2em] text-charcoal hover:bg-orange-deep"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="font-mono text-[11px] tracking-[0.16em] text-black hover:text-charcoal"
            >
              취소
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

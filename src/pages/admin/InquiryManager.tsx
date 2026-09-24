import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAgency } from "../../context/AgencyContext";
import type { Inquiry } from "../../types";

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Detail({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-mono text-xs tracking-[0.16em] text-black">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-lg text-black">{value}</p>
    </div>
  );
}

export function InquiryManager() {
  const { inquiries, markInquiryRead, removeInquiry } = useAgency();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (item: Inquiry) => {
    const next = openId === item.id ? null : item.id;
    setOpenId(next);
    if (next && !item.read) {
      markInquiryRead(item.id);
    }
  };

  return (
    <section>
      <div>
        <h2 className="font-display text-3xl text-charcoal">문의 수신함</h2>
        <p className="mt-2 max-w-xl text-lg text-black">
          CONTACT에서 보낸 문의가 여기에 쌓입니다. 이름, 연락처, 문의 유형,
          문의 내용을 확인할 수 있습니다.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <p className="mt-10 text-lg text-black">받은 문의가 없습니다.</p>
      ) : (
        <ul className="mt-10 divide-y divide-charcoal/10 border-t border-charcoal/10">
          {inquiries.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggle(item)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="flex flex-wrap items-center gap-3">
                      {!item.read ? (
                        <span className="bg-orange px-2 py-0.5 font-mono text-xs tracking-[0.16em] text-charcoal">
                          NEW
                        </span>
                      ) : null}
                      <span className="text-xl text-charcoal">{item.name}</span>
                      <span className="font-mono text-sm tracking-[0.14em] text-orange">
                        {item.typeLabel}
                      </span>
                    </p>
                    <p className="mt-2 text-base text-black">
                      {item.phone}
                      {item.company ? ` · ${item.company}` : ""}
                      {" · "}
                      {formatWhen(item.createdAt)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("이 문의를 삭제할까요?")) {
                        removeInquiry(item.id);
                        if (openId === item.id) setOpenId(null);
                      }
                    }}
                    className="inline-flex items-center gap-2 font-mono text-sm tracking-[0.16em] text-black hover:text-orange"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
                {open ? (
                  <div className="mt-6 grid gap-5 border-t border-charcoal/10 pt-5 md:grid-cols-2">
                    <Detail label="이름" value={item.name} />
                    <Detail label="연락처" value={item.phone} />
                    <Detail label="회사명" value={item.company} />
                    <Detail label="문의 유형" value={item.typeLabel} />
                    <div className="md:col-span-2">
                      <Detail label="접수 시각" value={formatWhen(item.createdAt)} />
                    </div>
                    <div className="md:col-span-2">
                      <Detail label="문의 내용" value={item.message} />
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 line-clamp-1 text-base text-black">
                    {item.message}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { journalPosts } from "../data/journal";
import type { JournalPost } from "../types";
import { DetailModal } from "./DetailModal";
import { JournalCard } from "./JournalCard";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { SmartImage } from "./SmartImage";

export function JournalSection() {
  const featured = journalPosts.find((post) => post.featured) ?? journalPosts[0];
  const rest = journalPosts.filter((post) => post.id !== featured.id);
  const [selected, setSelected] = useState<JournalPost | null>(null);

  return (
    <section id="journal" className="flex min-h-full items-center py-24 md:py-28">
      <div className="editorial-grid">
        <Reveal>
          <SectionLabel index="05" label="JOURNAL" />
          <h2 className="mb-10 font-display text-4xl font-semibold text-white md:mb-14 md:text-6xl">
            JOURNAL
          </h2>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <JournalCard post={featured} featured onOpen={setSelected} />
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-2" delay={0.1}>
            <div>
              {rest.map((post) => (
                <JournalCard key={post.id} post={post} onOpen={setSelected} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal title={selected.title} onClose={() => setSelected(null)}>
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-orange">
              {selected.category} · {selected.date}
            </p>
            <div className="mb-6 aspect-[16/10] overflow-hidden">
              <SmartImage
                src={selected.image}
                alt={selected.imageAlt}
                className="h-full w-full"
              />
            </div>
            <p className="leading-relaxed text-white/85">{selected.body}</p>
          </DetailModal>
        )}
      </AnimatePresence>
    </section>
  );
}

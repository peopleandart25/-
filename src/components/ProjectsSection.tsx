import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../data/projects";
import { useDragScroll } from "../hooks/useDragScroll";
import type { Project } from "../types";
import { DetailModal } from "./DetailModal";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { SmartImage } from "./SmartImage";

export function ProjectsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useDragScroll(scrollerRef);
  const [selected, setSelected] = useState<Project | null>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  return (
    <section id="projects" className="flex min-h-full flex-col justify-center py-24 md:py-28">
      <div className="editorial-grid">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <SectionLabel index="04" label="PROJECTS" />
              <h2 className="font-display text-4xl font-semibold text-white md:text-6xl">
                SELECTED PROJECTS
              </h2>
            </div>
            <div className="mb-1 hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors duration-300 hover:border-orange hover:text-orange"
                aria-label="이전 프로젝트"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors duration-300 hover:border-orange hover:text-orange"
                aria-label="다음 프로젝트"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1rem,calc((100%-min(1440px,calc(100%-2rem)))/2))] pb-6 md:gap-7 md:px-[max(2rem,calc((100%-min(1440px,calc(100%-4rem)))/2))]"
        aria-label="선정 작품 목록"
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onOpen={setSelected}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal title={selected.title} onClose={() => setSelected(null)}>
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-orange">
              {selected.field} · {selected.year}
            </p>
            <div className="mb-6 aspect-[16/10] overflow-hidden">
              <SmartImage
                src={selected.image}
                alt={selected.imageAlt}
                objectPosition={selected.objectPosition}
                className="h-full w-full"
              />
            </div>
            <p className="mb-3 text-sm text-white/50">
              {selected.artists.join(" · ")}
            </p>
            <p className="leading-relaxed text-white/85">{selected.synopsis}</p>
          </DetailModal>
        )}
      </AnimatePresence>
    </section>
  );
}

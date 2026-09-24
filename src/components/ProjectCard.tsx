import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Project } from "../types";
import { SmartImage } from "./SmartImage";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="w-[min(78vw,340px)] shrink-0 snap-start">
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="group block w-full text-left"
        aria-label={`${project.title} 자세히 보기`}
      >
        <div className={`${project.aspect} relative overflow-hidden bg-charcoal`}>
          <SmartImage
            src={project.image}
            alt={project.imageAlt}
            objectPosition={project.objectPosition}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {project.accent === "number" && (
            <span className="absolute left-4 top-4 font-display text-4xl text-orange">
              {number}
            </span>
          )}
          {project.accent === "icon" && (
            <span className="absolute right-4 top-4 text-orange">
              <Sparkles size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p
              className={`font-mono text-[10px] tracking-[0.2em] ${
                project.accent === "category" ? "text-orange" : "text-white/45"
              }`}
            >
              {project.field}
              {project.accent === "year" ? (
                <span className="text-orange"> · {project.year}</span>
              ) : (
                <span> · {project.year}</span>
              )}
            </p>
            <h3
              className={`mt-1 font-display text-3xl text-white ${
                project.accent === "line"
                  ? "border-b border-transparent pb-1 transition-colors duration-300 group-hover:border-orange"
                  : ""
              }`}
            >
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-white/50">
              {project.artists.join(" · ")}
            </p>
          </div>
          <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.16em] text-white/70 transition-colors duration-300 group-hover:text-orange">
            자세히 보기
            <ArrowUpRight size={13} strokeWidth={1.5} />
          </span>
        </div>
      </button>
    </article>
  );
}

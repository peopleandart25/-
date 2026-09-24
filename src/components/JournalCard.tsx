import { ArrowUpRight } from "lucide-react";
import type { JournalPost } from "../types";
import { SmartImage } from "./SmartImage";

interface JournalCardProps {
  post: JournalPost;
  featured?: boolean;
  onOpen: (post: JournalPost) => void;
}

export function JournalCard({
  post,
  featured = false,
  onOpen,
}: JournalCardProps) {
  const titleParts = splitTitle(post.title);

  if (featured) {
    return (
      <article className="group">
        <button
          type="button"
          onClick={() => onOpen(post)}
          className="block w-full text-left"
          aria-label={`${post.title} 자세히 보기`}
        >
          <div className="aspect-[16/10] overflow-hidden bg-charcoal md:aspect-[4/3]">
            <SmartImage
              src={post.image}
              alt={post.imageAlt}
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <p className="mt-5 font-mono text-[10px] tracking-[0.22em] text-orange">
            {post.category} · {post.date}
          </p>
          <h3 className="mt-3 font-display text-3xl leading-tight text-white md:text-5xl">
            {titleParts[0]}
            <span className="transition-colors duration-300 group-hover:text-orange">
              {titleParts[1]}
            </span>
          </h3>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/55">
            {post.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange">
            자세히 보기
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </span>
        </button>
      </article>
    );
  }

  return (
    <article className="group border-t border-white/12 py-5">
      <button
        type="button"
        onClick={() => onOpen(post)}
        className="grid w-full grid-cols-[96px_1fr] gap-4 text-left md:grid-cols-[120px_1fr]"
        aria-label={`${post.title} 자세히 보기`}
      >
        <div className="aspect-square overflow-hidden bg-charcoal">
          <SmartImage
            src={post.image}
            alt={post.imageAlt}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-orange">
            {post.category} · {post.date}
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight text-white">
            {titleParts[0]}
            <span className="transition-colors duration-300 group-hover:text-orange">
              {titleParts[1]}
            </span>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/50">{post.excerpt}</p>
        </div>
      </button>
    </article>
  );
}

function splitTitle(title: string): [string, string] {
  const pivot = Math.max(4, Math.floor(title.length * 0.55));
  return [title.slice(0, pivot), title.slice(pivot)];
}

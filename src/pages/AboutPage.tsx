import { BrandName, RichAmp } from "../components/Ampersand";
import { Reveal } from "../components/Reveal";
import { usePublicCopy } from "../hooks/usePublicCopy";

export function AboutPage() {
  const {
    kicker,
    headline,
    slogan,
    visionLabel,
    vision,
    intro,
    support,
  } = usePublicCopy();
  const lines = headline.split("\n");

  return (
    <main id="main" className="bg-ink pt-24 pb-20 md:pt-44 md:pb-32">
      <div className="editorial-grid">
        <Reveal>
          <p className="font-mono text-base tracking-[0.22em] text-orange md:text-lg">
            {kicker}
          </p>
          <p className="mt-6 font-mono text-base tracking-[0.2em] text-white/55 md:text-lg">
            <BrandName />
          </p>
          <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.08] text-white md:mt-10 md:text-7xl md:leading-[1.05]">
            {lines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 font-mono text-base tracking-[0.18em] text-orange md:mt-6 md:text-xl md:tracking-[0.2em]">
            {slogan}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="font-mono text-base tracking-[0.22em] text-white/40 md:text-lg">
              {visionLabel}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/90 md:text-2xl">
              {vision}
            </p>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.08}>
            <p className="text-base leading-relaxed text-white md:text-xl">
              <RichAmp text={intro} />
            </p>
            <p className="mt-5 text-base leading-relaxed text-white/55 md:text-xl">
              {support}
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

import Image from "next/image";
import { TEAM } from "@/lib/data";

export default function Team() {
  return (
    <section id="ekip" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
              Екипът
            </span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              Хората, които ще ви посрещнат.
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">
            Един и същ лекар води вашия случай от първия преглед до контролния.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t) => (
            <article key={t.name} className="reveal group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand shadow-soft">
                <Image
                  src={t.photo}
                  alt={t.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{t.name}</h3>
              <p className="text-sm font-semibold text-brand">{t.role}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{t.line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import { SERVICES, priceLabel } from "@/lib/data";

export default function Services() {
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));

  const total = useMemo(() => {
    const chosen = SERVICES.filter((s) => picked.includes(s.slug));
    return {
      eur: chosen.reduce((a, s) => a + s.price, 0),
      minutes: chosen.reduce((a, s) => a + s.duration, 0),
      count: chosen.length,
    };
  }, [picked]);

  const label = priceLabel(total.eur);

  const book = () => {
    window.dispatchEvent(
      new CustomEvent("lapa:select-services", { detail: picked })
    );
    document.getElementById("chas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="uslugi" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
            Услуги и цени
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            Цената я виждате тук, не на касата.
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Изберете услугите и вижте приблизителната сметка веднага. Ако по време
            на прегледа се наложи нещо повече, чувате цената преди да го направим.
          </p>
          </div>

          <ul className="grid gap-3 text-[15px]">
            {["Без скрити такси", "Плащане с карта", "Фактура при поискване"].map((t) => (
              <li key={t} className="flex items-center gap-2.5 font-medium text-ink-soft">
                <span className="grid size-6 place-items-center rounded-full bg-mint text-brand">
                  <Icon name="check" className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const on = picked.includes(s.slug);
            const p = priceLabel(s.price);
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => toggle(s.slug)}
                aria-pressed={on}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className={`reveal spotlight group relative rounded-[1.75rem] border p-6 text-left transition-all duration-300 ${
                  on
                    ? "border-brand bg-brand text-white shadow-lift"
                    : "border-ink/8 bg-white shadow-soft hover:-translate-y-1 hover:shadow-lift"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl transition ${
                      on ? "bg-white/15 text-white" : "bg-mint text-brand"
                    }`}
                  >
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <span
                    className={`grid size-7 place-items-center rounded-full border transition ${
                      on
                        ? "border-white bg-white text-brand"
                        : "border-ink/15 text-transparent group-hover:border-brand"
                    }`}
                  >
                    <Icon name="check" className="size-4" />
                  </span>
                </div>

                <h3
                  className={`mt-5 text-xl font-bold tracking-tight ${
                    on ? "text-white" : "text-ink"
                  }`}
                >
                  {s.title}
                </h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${on ? "text-white/80" : "text-ink-soft"}`}>
                  {s.blurb}
                </p>

                <div
                  className={`mt-5 flex items-end justify-between border-t pt-4 ${
                    on ? "border-white/20" : "border-ink/8"
                  }`}
                >
                  <div>
                    <div className={`text-2xl font-extrabold tracking-tight ${on ? "text-white" : "text-ink"}`}>
                      от {p.eur}
                    </div>
                    <div className={`text-sm ${on ? "text-white/70" : "text-ink-soft"}`}>
                      {p.bgn}
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${on ? "text-white/70" : "text-ink-soft"}`}>
                    ~{s.duration} мин
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className={`sticky bottom-4 z-30 mt-8 transition-all duration-500 ${
            total.count ? "translate-y-0 opacity-100" : "hidden"
          }`}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[1.75rem] bg-ink p-5 text-white shadow-lift sm:flex-row sm:p-6">
            <div className="flex-1 text-center sm:text-left">
              <div className="text-sm text-white/60">
                Избрани {total.count}{" "}
                {total.count === 1 ? "услуга" : "услуги"} · около {total.minutes} мин
              </div>
              <div className="mt-1 flex items-baseline justify-center gap-2 sm:justify-start">
                <span className="text-3xl font-extrabold tracking-tight">{label.eur}</span>
                <span className="text-white/60">{label.bgn}</span>
              </div>
            </div>
            <button
              onClick={book}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink transition hover:bg-mint sm:w-auto"
            >
              Запази час за това
              <Icon name="arrow" className="size-5" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Цените са в евро. Левовата равностойност е по фиксирания курс 1 € = 1,95583 лв. и е само за ориентир.
        </p>
      </div>
    </section>
  );
}

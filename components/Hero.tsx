import Image from "next/image";
import Counter from "./Counter";
import Icon from "./Icon";
import NextSlots from "./NextSlots";
import { CLINIC } from "@/lib/data";

export default function Hero() {
  return (
    <section className="grain relative -mt-[76px] overflow-hidden bg-ink pt-[76px] text-white">
      {/* depth: gradient wash, moving glow, engineering grid */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,#15514a_0%,#0c2b26_55%,#071c18_100%)]"
      />
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-24 right-[-10%] size-[38rem] rounded-full bg-brand-light/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12rem] left-[-8rem] size-[30rem] rounded-full bg-accent/15 blur-[120px]"
      />
      <div aria-hidden className="absolute inset-0 grid-lines" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.02fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <div>
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold text-white/90">
            <span className="size-1.5 rounded-full bg-emerald-300 dot-live" />
            Клиника и зоомагазин · кв. Лозенец, София
          </span>

          <h1 className="mt-7 text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.35rem]">
            Грижа без чакане.
            <br />
            <span className="text-glow">Цена без изненади.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            Запишете час за под минута и вижте сметката още преди да сте влезли.
            Нощем и в празници вдига дежурен лекар — не телефонен секретар.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#chas"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-lg font-semibold text-ink shadow-lift transition hover:bg-mint"
            >
              <Icon name="calendar" className="size-5" />
              Запази час онлайн
              <Icon
                name="arrow"
                className="size-5 transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href={`tel:${CLINIC.emergencyHref}`}
              className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-lg font-semibold text-white transition hover:bg-alarm hover:border-alarm"
            >
              <Icon name="alert" className="size-5" />
              Спешен случай 24/7
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7">
            <div>
              <dt className="sr-only">Оценка</dt>
              <dd className="flex items-baseline gap-1.5 text-3xl font-extrabold tracking-tight">
                <Counter to={4.9} decimals={1} />
                <Icon name="star" className="size-5 fill-accent text-accent" />
              </dd>
              <p className="mt-1 text-sm text-white/50">
                от <Counter to={CLINIC.reviewCount} /> отзива
              </p>
            </div>
            <div>
              <dt className="sr-only">Години</dt>
              <dd className="text-3xl font-extrabold tracking-tight">
                <Counter to={13} suffix=" г." />
              </dd>
              <p className="mt-1 text-sm text-white/50">в квартала</p>
            </div>
            <div>
              <dt className="sr-only">Спешен прием</dt>
              <dd className="text-3xl font-extrabold tracking-tight">24/7</dd>
              <p className="mt-1 text-sm text-white/50">дежурен лекар</p>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="ring-gradient relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift sm:aspect-square lg:aspect-[4/5]">
            <Image
              src="/images/hero.jpg"
              alt="Куче преди ветеринарен преглед"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          </div>

          <NextSlots />

          <div className="glass absolute -right-2 top-8 hidden items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lift lg:flex">
            <span className="grid size-7 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
              <Icon name="check" className="size-4" />
            </span>
            Потвърждение веднага
          </div>
        </div>
      </div>
    </section>
  );
}

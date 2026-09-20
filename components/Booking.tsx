"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon";
import { ANIMALS, CLINIC, SERVICES, TEAM, priceLabel } from "@/lib/data";
import { slotsFor, ymd } from "@/lib/slots";

const WEEKDAYS = ["нед", "пон", "вт", "ср", "чет", "пет", "съб"];
const MONTHS = [
  "януари", "февруари", "март", "април", "май", "юни",
  "юли", "август", "септември", "октомври", "ноември", "декември",
];

function icsFile(opts: {
  date: Date;
  time: string;
  minutes: number;
  services: string[];
  pet: string;
}) {
  const [h, m] = opts.time.split(":").map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + Math.max(opts.minutes, 30);
  const stamp = (mins: number) =>
    `${ymd(opts.date).replace(/-/g, "")}T${String(Math.floor(mins / 60)).padStart(2, "0")}${String(
      mins % 60
    ).padStart(2, "0")}00`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lapa Vet//BG//",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Sofia",
    "BEGIN:STANDARD",
    "DTSTART:19701025T040000",
    "TZOFFSETFROM:+0300",
    "TZOFFSETTO:+0200",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "TZNAME:EET",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:19700329T030000",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0300",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "TZNAME:EEST",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@lapa-vet.bg`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;TZID=Europe/Sofia:${stamp(startMin)}`,
    `DTEND;TZID=Europe/Sofia:${stamp(endMin)}`,
    `SUMMARY:Ветеринар — ${opts.pet || "преглед"} (Лапа)`,
    `DESCRIPTION:${opts.services.join(", ")}\\nТелефон: ${CLINIC.phone}`,
    `LOCATION:${CLINIC.address}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Час при ветеринар след 2 часа",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export default function Booking() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [animal, setAnimal] = useState<string>("dog");
  const [pet, setPet] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [vet, setVet] = useState("Всеки свободен лекар");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onPick = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      if (detail?.length) {
        setPicked(detail);
        setStep(1);
      }
    };
    window.addEventListener("lapa:select-services", onPick);
    return () => window.removeEventListener("lapa:select-services", onPick);
  }, []);

  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, [mounted]);

  const day = days[dayIndex];
  const slots = useMemo(() => (day ? slotsFor(day) : []), [day]);

  // Land on the first day that has something free, not on a day that is already gone.
  useEffect(() => {
    if (!mounted) return;
    const first = days.findIndex((d) => slotsFor(d).some((s) => s.free));
    if (first > 0) setDayIndex(first);
  }, [mounted, days]);

  const chosen = SERVICES.filter((s) => picked.includes(s.slug));
  const totalEur = chosen.reduce((a, s) => a + s.price, 0);
  const totalMin = chosen.reduce((a, s) => a + s.duration, 0) || 30;
  const price = priceLabel(totalEur);

  const animalLabel = ANIMALS.find((a) => a.id === animal)?.label ?? "";

  const canNext = [true, picked.length > 0, !!time, name.trim().length > 1 && phone.trim().length > 5][step];

  const download = () => {
    const blob = new Blob([icsFile({ date: day, time: time!, minutes: totalMin, services: chosen.map((c) => c.title), pet })], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chas-lapa.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = ["Любимец", "Услуга", "Ден и час", "Данни"];

  return (
    <section id="chas" className="relative bg-brand-dark py-20 text-white md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="reveal text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
            Онлайн записване
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            Час за под минута. Без обаждане.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Изберете кога ви е удобно. Получавате потвърждение веднага и SMS
            напомняне два часа преди прегледа.
          </p>
        </div>

        <div className="reveal mt-12 overflow-hidden rounded-[2rem] bg-white text-ink shadow-lift">
          {!done && (
            <div className="flex border-b border-ink/8">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`flex flex-1 items-center justify-center gap-2 px-2 py-4 text-sm font-semibold transition ${
                    i === step ? "bg-mint text-brand" : i < step ? "text-brand" : "text-ink-soft/60"
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                      i < step ? "bg-brand text-white" : i === step ? "bg-brand text-white" : "bg-ink/8"
                    }`}
                  >
                    {i < step ? <Icon name="check" className="size-3.5" /> : i + 1}
                  </span>
                  <span className="hidden sm:block">{s}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-10 md:min-h-[32rem]">
            {done ? (
              <div className="pop-in text-center">
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-mint text-brand">
                  <Icon name="check" className="size-10" />
                </span>
                <h3 className="mt-6 text-3xl font-extrabold tracking-tight">
                  Часът е запазен.
                </h3>
                <p className="mt-2 text-ink-soft">
                  Изпратихме потвърждение на {phone}. Очакваме ви.
                </p>

                <div className="mx-auto mt-8 max-w-md rounded-[1.5rem] border border-ink/8 bg-cream p-6 text-left">
                  <div className="flex items-center justify-between border-b border-ink/8 pb-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                      Вашият час
                    </span>
                    <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                      потвърден
                    </span>
                  </div>
                  <dl className="mt-4 space-y-3 text-[15px]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Кога</dt>
                      <dd className="text-right font-semibold">
                        {WEEKDAYS[day.getDay()]}, {day.getDate()} {MONTHS[day.getMonth()]} · {time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Пациент</dt>
                      <dd className="text-right font-semibold">
                        {pet ? `${pet} (${animalLabel.toLowerCase()})` : animalLabel}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Услуги</dt>
                      <dd className="text-right font-semibold">
                        {chosen.map((c) => c.title).join(", ")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">Лекар</dt>
                      <dd className="text-right font-semibold">{vet}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-ink/8 pt-3">
                      <dt className="text-ink-soft">Приблизително</dt>
                      <dd className="text-right">
                        <span className="text-lg font-extrabold">{price.eur}</span>
                        <span className="ml-2 text-sm text-ink-soft">{price.bgn}</span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={download}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition hover:bg-brand-dark"
                  >
                    <Icon name="calendar" className="size-5" />
                    Добави в календара
                  </button>
                  <button
                    onClick={() => {
                      setDone(false);
                      setStep(0);
                      setTime(null);
                      setPicked([]);
                      setPet("");
                      setName("");
                      setPhone("");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/12 px-6 py-3.5 font-semibold text-ink transition hover:bg-mint"
                  >
                    Нов час
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div className="pop-in">
                    <h3 className="text-2xl font-bold tracking-tight">Кого водите?</h3>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {ANIMALS.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setAnimal(a.id)}
                          className={`rounded-2xl border p-5 text-center transition ${
                            animal === a.id
                              ? "border-brand bg-mint text-brand shadow-soft"
                              : "border-ink/10 hover:border-brand/40"
                          }`}
                        >
                          <span className="block text-3xl">{a.emoji}</span>
                          <span className="mt-2 block font-semibold">{a.label}</span>
                        </button>
                      ))}
                    </div>
                    <label className="mt-6 block">
                      <span className="text-sm font-semibold text-ink-soft">
                        Как се казва? (по желание)
                      </span>
                      <input
                        value={pet}
                        onChange={(e) => setPet(e.target.value)}
                        placeholder="Например: Рекс"
                        className="mt-2 w-full rounded-2xl border border-ink/12 bg-cream px-5 py-4 text-lg outline-none transition focus:border-brand focus:bg-white"
                      />
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div className="pop-in">
                    <h3 className="text-2xl font-bold tracking-tight">За какво идвате?</h3>
                    <p className="mt-1 text-ink-soft">Може да изберете повече от едно.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {SERVICES.map((s) => {
                        const on = picked.includes(s.slug);
                        const p = priceLabel(s.price);
                        return (
                          <button
                            key={s.slug}
                            onClick={() =>
                              setPicked((v) =>
                                v.includes(s.slug) ? v.filter((x) => x !== s.slug) : [...v, s.slug]
                              )
                            }
                            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                              on ? "border-brand bg-mint" : "border-ink/10 hover:border-brand/40"
                            }`}
                          >
                            <span
                              className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                                on ? "bg-brand text-white" : "bg-cream text-brand"
                              }`}
                            >
                              <Icon name={s.icon} className="size-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold">{s.title}</span>
                              <span className="block text-sm text-ink-soft">
                                от {p.eur} · ~{s.duration} мин
                              </span>
                            </span>
                            <span
                              className={`grid size-6 shrink-0 place-items-center rounded-full border ${
                                on ? "border-brand bg-brand text-white" : "border-ink/15 text-transparent"
                              }`}
                            >
                              <Icon name="check" className="size-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="pop-in">
                    <h3 className="text-2xl font-bold tracking-tight">Кога ви е удобно?</h3>

                    {!mounted ? (
                      <div className="mt-6 h-24 animate-pulse rounded-2xl bg-cream" />
                    ) : (
                      <>
                        <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-2">
                          {days.map((d, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setDayIndex(i);
                                setTime(null);
                              }}
                              className={`min-w-[5.2rem] shrink-0 rounded-2xl border px-3 py-3 text-center transition ${
                                i === dayIndex
                                  ? "border-brand bg-brand text-white shadow-soft"
                                  : "border-ink/10 hover:border-brand/40"
                              }`}
                            >
                              <span className="block text-xs uppercase tracking-wide opacity-70">
                                {i === 0 ? "днес" : i === 1 ? "утре" : WEEKDAYS[d.getDay()]}
                              </span>
                              <span className="mt-0.5 block text-xl font-bold">{d.getDate()}</span>
                              <span className="block text-xs opacity-70">
                                {MONTHS[d.getMonth()].slice(0, 3)}
                              </span>
                            </button>
                          ))}
                        </div>

                        {slots.every((s) => !s.free) && (
                          <p className="mt-6 rounded-2xl bg-cream px-5 py-4 text-[15px] text-ink-soft">
                            За този ден няма свободни часове. Изберете друг ден или ни
                            се обадете — пазим по два слота на ден за спешни случаи.
                          </p>
                        )}

                        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {slots.map((s) => (
                            <button
                              key={s.time}
                              disabled={!s.free}
                              onClick={() => setTime(s.time)}
                              className={`rounded-xl border py-3 text-[15px] font-semibold transition ${
                                time === s.time
                                  ? "border-brand bg-brand text-white"
                                  : s.free
                                    ? "border-ink/10 hover:border-brand hover:text-brand"
                                    : "cursor-not-allowed border-transparent bg-cream text-ink-soft/35 line-through"
                              }`}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>

                        <label className="mt-8 block">
                          <span className="text-sm font-semibold text-ink-soft">Предпочитан лекар</span>
                          <select
                            value={vet}
                            onChange={(e) => setVet(e.target.value)}
                            className="mt-2 w-full appearance-none rounded-2xl border border-ink/12 bg-cream px-5 py-4 text-lg outline-none transition focus:border-brand focus:bg-white"
                          >
                            <option>Всеки свободен лекар</option>
                            {TEAM.filter((t) => t.name.startsWith("д-р")).map((t) => (
                              <option key={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </label>
                      </>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="pop-in">
                    <h3 className="text-2xl font-bold tracking-tight">Как да ви потърсим?</h3>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-semibold text-ink-soft">Вашето име</span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Име и фамилия"
                          className="mt-2 w-full rounded-2xl border border-ink/12 bg-cream px-5 py-4 text-lg outline-none transition focus:border-brand focus:bg-white"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-ink-soft">Телефон</span>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          placeholder="08XX XXX XXX"
                          className="mt-2 w-full rounded-2xl border border-ink/12 bg-cream px-5 py-4 text-lg outline-none transition focus:border-brand focus:bg-white"
                        />
                      </label>
                    </div>

                    <div className="mt-6 rounded-2xl bg-cream p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-[15px] text-ink-soft">
                          {day && (
                            <>
                              {WEEKDAYS[day.getDay()]}, {day.getDate()} {MONTHS[day.getMonth()]} в{" "}
                              <strong className="text-ink">{time}</strong> ·{" "}
                              {chosen.map((c) => c.title).join(", ")}
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-extrabold">{price.eur}</div>
                          <div className="text-sm text-ink-soft">{price.bgn}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/8 pt-6">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className={`rounded-full px-5 py-3 font-semibold text-ink-soft transition hover:text-ink ${
                      step === 0 ? "invisible" : ""
                    }`}
                  >
                    Назад
                  </button>
                  <button
                    disabled={!canNext}
                    onClick={() => (step === 3 ? setDone(true) : setStep((s) => s + 1))}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/12 disabled:text-ink-soft"
                  >
                    {step === 3 ? "Потвърди часа" : "Напред"}
                    <Icon name="arrow" className="size-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="reveal mt-6 text-center text-sm text-white/50">
          Предпочитате по телефон? Обадете се на{" "}
          <a href={`tel:${CLINIC.phoneHref}`} className="font-semibold text-white underline">
            {CLINIC.phone}
          </a>
        </p>
      </div>
    </section>
  );
}

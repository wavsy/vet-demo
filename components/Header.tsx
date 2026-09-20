"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import OpenStatus from "./OpenStatus";
import { CLINIC } from "@/lib/data";

const NAV = [
  { href: "#uslugi", label: "Услуги и цени" },
  { href: "#ekip", label: "Екип" },
  { href: "#otzivi", label: "Отзиви" },
  { href: "#magazin", label: "Зоомагазин" },
  { href: "#kontakti", label: "Контакти" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <div className="hidden bg-brand-dark text-white/85 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">
          <OpenStatus />
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Icon name="pin" className="size-4" />
              {CLINIC.address}
            </span>
            <a
              href={`tel:${CLINIC.emergencyHref}`}
              className="flex items-center gap-2 font-semibold text-white transition hover:text-accent-soft"
            >
              <Icon name="alert" className="size-4" />
              Спешен телефон 24/7 · {CLINIC.emergency}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-cream/85 shadow-soft backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <a href="#" className="flex items-center gap-2.5" aria-label={CLINIC.name}>
            <span
              className={`grid size-10 place-items-center rounded-2xl transition ${
                scrolled ? "bg-brand text-white" : "bg-white/10 text-white ring-1 ring-white/20"
              }`}
            >
              <Icon name="paw" className="size-5" />
            </span>
            <span className="leading-tight">
              <span
                className={`block text-lg font-extrabold tracking-tight transition ${
                  scrolled ? "text-ink" : "text-white"
                }`}
              >
                Лапа
              </span>
              <span
                className={`block text-[11px] font-medium uppercase tracking-[0.16em] transition ${
                  scrolled ? "text-ink-soft" : "text-white/55"
                }`}
              >
                Ветеринарна клиника
              </span>
            </span>
          </a>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${
                  scrolled
                    ? "text-ink-soft hover:bg-mint hover:text-brand"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <a
              href={`tel:${CLINIC.phoneHref}`}
              className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-[15px] font-semibold transition sm:flex ${
                scrolled
                  ? "border-brand/15 text-brand hover:bg-mint"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <Icon name="phone" className="size-4" />
              {CLINIC.phone}
            </a>
            <a
              href="#chas"
              className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold shadow-soft transition sm:flex ${
                scrolled ? "bg-brand text-white hover:bg-brand-dark" : "bg-white text-ink hover:bg-mint"
              }`}
            >
              Запази час
              <Icon name="arrow" className="size-4" />
            </a>
            <button
              onClick={() => setMenu(true)}
              className={`grid size-11 place-items-center rounded-full border transition lg:hidden ${
                scrolled ? "border-brand/15 text-brand" : "border-white/20 text-white"
              }`}
              aria-label="Меню"
            >
              <Icon name="menu" className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-[60] bg-cream p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold">Лапа</span>
            <button
              onClick={() => setMenu(false)}
              className="grid size-11 place-items-center rounded-full border border-brand/15 text-brand"
              aria-label="Затвори"
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-2">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="rounded-2xl px-4 py-4 text-2xl font-semibold tracking-tight transition hover:bg-mint"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <a
              href="#chas"
              onClick={() => setMenu(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-lg font-semibold text-white"
            >
              Запази час онлайн
            </a>
            <a
              href={`tel:${CLINIC.emergencyHref}`}
              className="flex items-center justify-center gap-2 rounded-full border border-alarm/25 px-6 py-4 text-lg font-semibold text-alarm"
            >
              <Icon name="alert" className="size-5" />
              Спешен телефон 24/7
            </a>
          </div>
        </div>
      )}
    </>
  );
}

import Icon from "./Icon";
import { CLINIC } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-brand-dark pb-28 pt-16 text-white/70 md:pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <span className="grid size-10 place-items-center rounded-2xl bg-white/10">
                <Icon name="paw" className="size-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">Лапа</span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed">
              Ветеринарна клиника и зоомагазин в кв. Лозенец, София. Работим от{" "}
              {CLINIC.founded} г.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">Услуги</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              <li><a href="#uslugi" className="transition hover:text-white">Профилактика и ваксини</a></li>
              <li><a href="#uslugi" className="transition hover:text-white">Хирургия</a></li>
              <li><a href="#uslugi" className="transition hover:text-white">Образна диагностика</a></li>
              <li><a href="#magazin" className="transition hover:text-white">Зоомагазин</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white">Клиниката</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              <li><a href="#ekip" className="transition hover:text-white">Екип</a></li>
              <li><a href="#otzivi" className="transition hover:text-white">Отзиви</a></li>
              <li><a href="#kontakti" className="transition hover:text-white">Контакти</a></li>
              <li><a href="#chas" className="transition hover:text-white">Запази час</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white">Връзка</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              <li><a href={`tel:${CLINIC.phoneHref}`} className="transition hover:text-white">{CLINIC.phone}</a></li>
              <li>
                <a href={`tel:${CLINIC.emergencyHref}`} className="font-semibold text-white transition hover:text-accent-soft">
                  Спешно 24/7 · {CLINIC.emergency}
                </a>
              </li>
              <li><a href={`mailto:${CLINIC.email}`} className="transition hover:text-white">{CLINIC.email}</a></li>
              <li>{CLINIC.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {CLINIC.name}</p>
          <p>
            Сайт от{" "}
            <a
              href="https://wavsy.dev"
              target="_blank"
              rel="noopener"
              className="font-semibold text-white underline underline-offset-4"
            >
              Wavsy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

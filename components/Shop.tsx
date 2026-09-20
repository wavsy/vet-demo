import Image from "next/image";
import Icon from "./Icon";

const ITEMS = [
  { title: "Лечебни храни", text: "Ветеринарни диети за бъбреци, стомах, стави и тегло." },
  { title: "Обезпаразитяване", text: "Таблетки, спот-он и каишки — с дозата за вашето животно." },
  { title: "Аксесоари", text: "Нашийници, транспортни чанти, играчки и легла." },
  { title: "Микрочип и паспорт", text: "Поставяме чипа и издаваме паспорта на място." },
];

export default function Shop() {
  return (
    <section id="magazin" className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <span className="reveal text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Зоомагазин на място
            </span>
            <h2 className="reveal mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              Излизате от прегледа
              <br />
              с това, което ви трябва.
            </h2>
            <p className="reveal mt-5 max-w-lg text-lg text-ink-soft">
              Без втора обиколка из града. Лекарят изписва храната или лекарството
              и го вземате от съседната врата.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {ITEMS.map((i) => (
                <div key={i.title} className="reveal flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-soft">
                    <Icon name="cart" className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold tracking-tight">{i.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{i.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-lift">
            <Image
              src="/images/shop.jpg"
              alt="Стопанка с кучето си"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

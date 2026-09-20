import { CLINIC, SERVICE_META, priceLabel, type Content, type Lang } from "./content";
import { nextAvailability } from "./slots";

export type Answer = {
  text: string;
  actions?: { label: string; href: string }[];
};

type Rule = {
  id: string;
  bg: string[];
  en: string[];
  reply: (t: Content, lang: Lang) => Answer;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:()„“"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function priceLine(t: Content, lang: Lang, index: number) {
  const p = priceLabel(SERVICE_META[index].price, lang);
  return `${t.services.items[index].title} — ${t.services.from} ${p.eur} (${p.bgn}), ~${SERVICE_META[index].duration} ${t.services.min}`;
}

function bookAction(t: Content) {
  return { label: t.nav.book, href: "#chas" };
}
function callAction(t: Content) {
  return { label: t.contact.reception, href: `tel:${CLINIC.phoneHref}` };
}
function emergencyAction(t: Content) {
  return { label: t.topbar.emergency, href: `tel:${CLINIC.emergencyHref}` };
}

const RULES: Rule[] = [
  {
    id: "emergency",
    bg: ["спешн", "спешен", "спешно", "кърви", "отров", "натрав", "не диша", "припадна", "блъсна", "прегази", "усукв", "не може да пишка", "не уринира", "гърч", "счупи"],
    en: ["emergency", "urgent", "bleeding", "poison", "not breathing", "hit by", "seizure", "collapsed", "swallowed", "can't pee", "cannot urinate", "broken leg"],
    reply: (t) => ({
      text:
        t.lang === "bg"
          ? `Звъннете веднага на ${CLINIC.emergency} — дежурният лекар вдига денонощно, включително в празници. Тръгвайте към клиниката и се обадете от пътя; ако случаят е спешен, Ви чакаме на вратата. Адресът е ${t.address}.`
          : `Call ${CLINIC.emergency} right now — the vet on call answers around the clock, holidays included. Set off towards the clinic and call from the road; if it's urgent we'll be waiting at the door. The address is ${t.address}.`,
      actions: [emergencyAction(t)],
    }),
  },
  {
    id: "price-exam",
    bg: ["колко струва преглед", "цена на преглед", "преглед цена", "профилактичен преглед"],
    en: ["how much is an exam", "exam price", "check-up price", "wellness exam"],
    reply: (t, l) => ({
      text:
        t.lang === "bg"
          ? `${priceLine(t, l, 0)}. Ако се наложи изследване, чувате цената, преди да го направим.`
          : `${priceLine(t, l, 0)}. If a test is needed, you hear the price before we do it.`,
      actions: [bookAction(t)],
    }),
  },
  {
    id: "price-vaccine",
    bg: ["ваксин", "паспорт", "бяс", "микрочип", "чип"],
    en: ["vaccin", "passport", "rabies", "microchip", "chip"],
    reply: (t, l) => ({
      text:
        t.lang === "bg"
          ? `${priceLine(t, l, 1)}. Международният паспорт и микрочипът се правят на място. За пътуване планирайте поне 21 дни след ваксината срещу бяс.`
          : `${priceLine(t, l, 1)}. The EU passport and microchip are done on site. For travel, plan at least 21 days after the rabies vaccine.`,
      actions: [bookAction(t)],
    }),
  },
  {
    id: "price-neuter",
    bg: ["кастрац", "операц", "хирург", "стерилиз"],
    en: ["neuter", "spay", "surgery", "castrat"],
    reply: (t, l) => ({
      text:
        t.lang === "bg"
          ? `${priceLine(t, l, 5)}. Работим с инхалационна анестезия и мониторинг. Точната цена зависи от вида и теглото — казваме я преди операцията.`
          : `${priceLine(t, l, 5)}. We use inhalation anaesthesia with monitoring. The exact price depends on species and weight — you get it before surgery.`,
      actions: [bookAction(t)],
    }),
  },
  {
    id: "price-all",
    bg: ["цен", "колко струва", "тарифа", "ценоразпис", "скъпо"],
    en: ["price", "cost", "how much", "fee", "rate"],
    reply: (t, l) => ({
      text:
        (t.lang === "bg" ? "Ето основните цени:\n" : "Here are the main prices:\n") +
        [0, 1, 2, 3, 4, 5].map((i) => `• ${priceLine(t, l, i)}`).join("\n") +
        (t.lang === "bg"
          ? "\nВсички цени са в евро, с левова равностойност за ориентир."
          : "\nAll prices are in euro, with the lev equivalent for reference."),
      actions: [bookAction(t)],
    }),
  },
  {
    id: "hours",
    bg: ["работно време", "отворен", "затворен", "неделя", "събота", "почивен", "празник", "до колко", "от колко"],
    en: ["open", "hours", "closed", "sunday", "saturday", "holiday", "what time"],
    reply: (t) => ({
      text:
        (t.lang === "bg" ? "Работното време е:\n" : "Our opening hours:\n") +
        t.contact.hours.map((h) => `• ${h.day}: ${h.from} – ${h.to}`).join("\n") +
        (t.lang === "bg"
          ? `\nСпешните случаи се приемат денонощно на ${CLINIC.emergency}.`
          : `\nEmergencies are taken around the clock on ${CLINIC.emergency}.`),
      actions: [bookAction(t)],
    }),
  },
  {
    id: "booking",
    bg: ["час", "запази", "запаз", "записв", "запиши", "свободн", "кога мога", "резерв"],
    en: ["book", "appointment", "slot", "available", "reserve", "schedule"],
    reply: (t) => {
      const next = nextAvailability(3);
      const when = next
        ? next.offset === 0
          ? t.hero.today
          : next.offset === 1
            ? t.hero.tomorrow
            : `${t.booking.weekdays[next.date.getDay()]}, ${next.date.getDate()} ${
                t.booking.months[next.date.getMonth()]
              }`
        : "";
      return {
        text: next
          ? t.lang === "bg"
            ? `Най-ранните свободни часове са ${when}: ${next.times.join(", ")}. Записването отнема под минута и получавате потвърждение веднага.`
            : `The earliest free times are ${when}: ${next.times.join(", ")}. Booking takes under a minute and you get instant confirmation.`
          : t.lang === "bg"
            ? "В момента няма свободни часове онлайн. Обадете се на регистратурата и ще Ви намерим място."
            : "There are no online slots right now. Call reception and we'll find you a place.",
        actions: [bookAction(t), callAction(t)],
      };
    },
  },
  {
    id: "address",
    bg: ["адрес", "къде се намира", "как да стигна", "паркинг", "карта", "квартал"],
    en: ["address", "where are you", "how to get", "parking", "map", "location"],
    reply: (t) => ({
      text:
        t.lang === "bg"
          ? `Намираме се на ${t.address}. Картата е най-долу на страницата, а телефонът на регистратурата е ${CLINIC.phone}.`
          : `We're at ${t.address}. The map is at the bottom of the page and reception is on ${CLINIC.phone}.`,
      actions: [{ label: t.nav.contact, href: "#kontakti" }],
    }),
  },
  {
    id: "animals",
    bg: ["котк", "коте", "гризач", "заек", "папагал", "птиц", "влечуг", "костенурк", "змия", "екзотич", "хамстер"],
    en: ["cat", "rodent", "rabbit", "parrot", "bird", "reptile", "turtle", "snake", "exotic", "hamster"],
    reply: (t) => ({
      text:
        t.lang === "bg"
          ? "Да, работим с кучета, котки, гризачи, птици и влечуги. За котките има отделна чакалня, за да не се стресират от кучетата. Екзотичните животни приемаме след предварителна уговорка."
          : "Yes — dogs, cats, rodents, birds and reptiles. Cats have a separate waiting area so they aren't stressed by dogs. Exotics are seen by prior arrangement.",
      actions: [bookAction(t)],
    }),
  },
  {
    id: "payment",
    bg: ["плащ", "карта", "в брой", "фактура", "бон", "евро", "лева"],
    en: ["pay", "card", "cash", "invoice", "receipt", "euro", "lev"],
    reply: (t) => ({
      text:
        t.lang === "bg"
          ? "Плащате в брой или с карта. Издаваме фискален бон, а при поискване и фактура. Цените са в евро, с левова равностойност по фиксирания курс 1 € = 1,95583 лв."
          : "You can pay in cash or by card. We issue a receipt and an invoice on request. Prices are in euro, with the lev equivalent at the fixed rate €1 = BGN 1.95583.",
    }),
  },
  {
    id: "shop",
    bg: ["магазин", "храна", "обезпараз", "нашийник", "играчк", "диета"],
    en: ["shop", "food", "deworm", "collar", "toy", "diet"],
    reply: (t) => ({
      text:
        t.lang === "bg"
          ? "Зоомагазинът е в съседната врата на клиниката — лечебни храни, обезпаразитяване с точната доза, аксесоари. Лекарят изписва и вземате всичко на място."
          : "The pet shop is right next door to the clinic — prescription diets, parasite control dosed for your animal, accessories. The vet prescribes and you pick it up on the spot.",
      actions: [{ label: t.nav.shop, href: "#magazin" }],
    }),
  },
  {
    id: "team",
    bg: ["лекар", "доктор", "екип", "кой ще", "специалист"],
    en: ["vet", "doctor", "team", "who will", "specialist"],
    reply: (t) => ({
      text:
        (t.lang === "bg" ? "Екипът е:\n" : "The team:\n") +
        t.team.members.map((m) => `• ${m.name} — ${m.role}`).join("\n") +
        (t.lang === "bg"
          ? "\nПри записване може да изберете предпочитан лекар."
          : "\nYou can choose your preferred vet when booking."),
      actions: [{ label: t.nav.team, href: "#ekip" }],
    }),
  },
  {
    id: "greeting",
    bg: ["здравей", "здрасти", "добър ден", "добро утро", "добър вечер", "ехо"],
    en: ["hello", "hi ", "hey", "good morning", "good evening"],
    reply: (t) => ({
      text:
        t.lang === "bg"
          ? "Здравейте! С какво мога да Ви помогна — цени, свободни часове, работно време или спешен случай?"
          : "Hello! How can I help — prices, available times, opening hours or an emergency?",
    }),
  },
  {
    id: "thanks",
    bg: ["благодар", "мерси", "супер", "ок"],
    en: ["thank", "thanks", "great", "ok"],
    reply: (t) => ({
      text:
        t.lang === "bg"
          ? "За нищо. Ако решите да запазите час, отнема под минута."
          : "You're welcome. If you decide to book, it takes under a minute.",
      actions: [bookAction(t)],
    }),
  },
];

export function answer(question: string, t: Content, lang: Lang): Answer {
  const q = norm(question);
  if (!q) return { text: t.assistant.fallback.replace("{phone}", CLINIC.phone) };

  for (const rule of RULES) {
    const keys = lang === "bg" ? rule.bg : rule.en;
    if (keys.some((k) => q.includes(k))) return rule.reply(t, lang);
  }

  // A question in the other language should still be understood.
  for (const rule of RULES) {
    const keys = lang === "bg" ? rule.en : rule.bg;
    if (keys.some((k) => q.includes(k))) return rule.reply(t, lang);
  }

  return {
    text: t.assistant.fallback.replace("{phone}", CLINIC.phone),
    actions: [{ label: t.nav.book, href: "#chas" }, callAction(t)],
  };
}

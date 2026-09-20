"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { nextAvailability } from "@/lib/slots";

const WEEKDAYS = ["нед", "пон", "вт", "ср", "чет", "пет", "съб"];
const MONTHS = [
  "януари", "февруари", "март", "април", "май", "юни",
  "юли", "август", "септември", "октомври", "ноември", "декември",
];

export default function NextSlots() {
  const [data, setData] = useState<ReturnType<typeof nextAvailability>>(null);

  useEffect(() => {
    setData(nextAvailability(3));
    const t = setInterval(() => setData(nextAvailability(3)), 60_000);
    return () => clearInterval(t);
  }, []);

  const when = data
    ? data.label ??
      `${WEEKDAYS[data.date.getDay()]}, ${data.date.getDate()} ${MONTHS[data.date.getMonth()]}`
    : "";

  return (
    <div className="glass absolute -bottom-8 left-3 w-[min(21rem,88%)] rounded-3xl p-5 shadow-lift sm:-left-10">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/12 text-white">
          <Icon name="clock" className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold">Свободни часове</div>
          <span className="text-sm text-white/60">
            {data ? `най-рано ${when}` : "проверяваме наличността…"}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {(data?.times ?? ["", "", ""]).map((t, i) => (
          <a
            key={t || i}
            href="#chas"
            className={`flex-1 rounded-xl border border-white/15 bg-white/5 py-2 text-center text-sm font-semibold transition hover:bg-white hover:text-ink ${
              t ? "" : "pointer-events-none text-transparent"
            }`}
          >
            {t || "--:--"}
          </a>
        ))}
      </div>
    </div>
  );
}

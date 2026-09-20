import Icon from "./Icon";
import { CLINIC } from "@/lib/data";

export default function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/8 bg-cream/95 p-3 backdrop-blur-xl md:hidden">
      <div className="flex gap-2">
        <a
          href={`tel:${CLINIC.phoneHref}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-brand/15 bg-white py-3.5 font-semibold text-brand"
        >
          <Icon name="phone" className="size-5" />
          Обади се
        </a>
        <a
          href="#chas"
          className="flex flex-[1.3] items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-semibold text-white"
        >
          <Icon name="calendar" className="size-5" />
          Запази час
        </a>
      </div>
    </div>
  );
}

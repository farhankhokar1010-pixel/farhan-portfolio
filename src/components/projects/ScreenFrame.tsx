import Image from "next/image";
import type { ProjectScreen } from "@/data/types";
import { cn } from "@/lib/cn";

/** Browser-style frame around a screenshot. Click to enlarge. */
export function ScreenFrame({
  screen, onClick, sizes = "(min-width: 1024px) 700px, 100vw", priority = false, className, label = "ZOOM", style,
}: {
  screen: ProjectScreen; onClick?: () => void; sizes?: string; priority?: boolean; className?: string; label?: string; style?: React.CSSProperties;
}) {
  return (
    <figure style={style} className={cn("overflow-hidden rounded-xl border border-black/10 bg-white shadow-lift", className)}>
      <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-2" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate font-mono text-[0.62rem] text-neutral-600">{screen.caption}</span>
      </div>
      <button
        type="button"
        onClick={onClick}
        data-cursor="button"
        data-cursor-label={label}
        aria-label={`Enlarge screenshot: ${screen.caption}`}
        className="block w-full"
      >
        <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes={sizes} priority={priority} fetchPriority={priority ? "high" : "low"} className="h-auto w-full" />
      </button>
    </figure>
  );
}

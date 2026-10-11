import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium " +
  "transition-[transform,background-color,color,border-color] duration-300 ease-cinematic " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong shadow-soft",
  secondary: "border border-line bg-elevated text-ink hover:border-accent",
  ghost: "text-ink hover:text-accent-text",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className, ...rest }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} data-cursor="button" {...rest} />;
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; cursorLabel?: string };

/** Anchor styled like a button — use for navigation (e.g. "#work"). */
export function ButtonLink({ variant = "primary", className, cursorLabel, ...rest }: LinkProps) {
  return <a className={cn(base, variants[variant], className)} data-cursor="button" data-cursor-label={cursorLabel} {...rest} />;
}

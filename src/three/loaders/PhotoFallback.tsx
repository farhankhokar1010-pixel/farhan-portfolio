import Image from "next/image";

/** Shown when WebGL is unavailable or the model fails to load. */
export function PhotoFallback({ reason }: { reason: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Image
        src="/images/farhan-profile.webp"
        alt="Muhammad Farhan"
        width={240}
        height={240}
        priority
        className="rounded-full shadow-lift"
      />
      <p className="label">{reason}</p>
    </div>
  );
}

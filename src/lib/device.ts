/** Network / device hints used to decide which 3D model to fetch and whether to fetch it automatically. */
interface NetInfo { saveData?: boolean; effectiveType?: string; downlink?: number }
const conn = (): NetInfo | undefined => (navigator as unknown as { connection?: NetInfo }).connection;

/** The visitor asked for less data, or the link is 2G-class: don't download the 3D model unasked. */
export function isVerySlowConnection(): boolean {
  const c = conn();
  return !!c?.saveData || c?.effectiveType === "slow-2g" || c?.effectiveType === "2g";
}

/** Phones, tablets, weak devices and slow links get the tiny model (~170 KB). Desktops on a normal link get the standard one (~520 KB). */
export function shouldUseMobileModel(perfReduced: boolean): boolean {
  if (perfReduced) return true;
  const c = conn();
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const narrow = window.matchMedia("(max-width: 1023px)").matches;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const slowLink = c?.downlink !== undefined && c.downlink > 0 && c.downlink < 2.5; // Mbps estimate (Chrome/Android)
  return narrow || touch || slowLink || !!c?.saveData || c?.effectiveType === "3g" || c?.effectiveType === "2g" || c?.effectiveType === "slow-2g" || (mem !== undefined && mem <= 4);
}

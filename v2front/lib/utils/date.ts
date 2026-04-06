/**
 * Date utilities — no external dependencies.
 * Mongolian relative time + formatting helpers.
 */

const MN_MONTHS = [
  '1-р сар', '2-р сар', '3-р сар', '4-р сар',
  '5-р сар', '6-р сар', '7-р сар', '8-р сар',
  '9-р сар', '10-р сар', '11-р сар', '12-р сар',
];

/**
 * Mongolian relative time — "2 цагийн өмнө", "3 хоногийн өмнө" etc.
 */
export function relativeTimeMn(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const diffMs = Date.now() - date.getTime();
    if (isNaN(diffMs)) return '—';

    const absDiff = Math.abs(diffMs);
    const suffix  = diffMs >= 0 ? 'өмнө' : 'дараа';

    const minutes = Math.floor(absDiff / 60_000);
    const hours   = Math.floor(absDiff / 3_600_000);
    const days    = Math.floor(absDiff / 86_400_000);
    const weeks   = Math.floor(days / 7);
    const months  = Math.floor(days / 30);
    const years   = Math.floor(days / 365);

    if (minutes < 1)    return 'Дөнгөж сая';
    if (minutes < 60)   return `${minutes} минутын ${suffix}`;
    if (hours   < 24)   return `${hours} цагийн ${suffix}`;
    if (days    < 7)    return `${days} хоногийн ${suffix}`;
    if (weeks   < 5)    return `${weeks} долоо хоногийн ${suffix}`;
    if (months  < 12)   return `${months} сарын ${suffix}`;
    return `${years} жилийн ${suffix}`;
  } catch {
    return '—';
  }
}

/**
 * Format: "2024 оны 3 сарын 15, 14:30"
 */
export function formatDatetimeMn(dateInput: string | Date): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '—';
    const year  = d.getFullYear();
    const month = MN_MONTHS[d.getMonth()];
    const day   = d.getDate();
    const hh    = String(d.getHours()).padStart(2, '0');
    const mm    = String(d.getMinutes()).padStart(2, '0');
    return `${year} оны ${month}-н ${day}, ${hh}:${mm}`;
  } catch {
    return '—';
  }
}

/**
 * Format: "2024-03-15"
 */
export function formatDateShort(dateInput: string | Date): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('mn-MN');
  } catch {
    return '—';
  }
}

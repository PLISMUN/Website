/**
 * Validation shared by every endpoint that writes a row of the people table
 * (students through setPeopleInfo, supervisors through setSupervisorApplication).
 * Lives outside src/pages/api so it isn't exposed as a route.
 */

export const validDiets = [
  "Omnivore", "Vegetarian", "Vegan", "Gluten Free", "Lactose Free", "Withdraw"
];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Normalize birth to YYYY-MM-DD accepting multiple common formats:
// - ISO dates with or without time (1975-11-07 or 1975-11-07T00:00:00Z)
// - YYYY-MM (will become YYYY-MM-01)
// - timestamps (ms)
// - localized slash formats (07/11/1975 or 11/07/1975) — try to disambiguate by value
const tryParseDate = (v: string): string | null => {
  const s = v.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
  if (s.includes('T')) return s.split('T')[0];
  if (s.includes(' ')) {
    // "YYYY-MM-DD hh:mm:ss" or similar
    const first = s.split(' ')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(first)) return first;
  }
  if (s.includes('/')) {
    const parts = s.split('/').map(p => p.trim());
    if (parts.length === 3) {
      // If first part has length 4 -> YYYY/MM/DD
      if (parts[0].length === 4 && /^\d{4}$/.test(parts[0])) {
        return `${parts[0]}-${pad(Number(parts[1]))}-${pad(Number(parts[2]))}`;
      }
      const a = Number(parts[0]), b = Number(parts[1]), c = Number(parts[2]);
      // If first part > 12, treat as DD/MM/YYYY (common in Europe)
      if (a > 12) {
        return `${c}-${pad(b)}-${pad(a)}`;
      }
      // Otherwise try MM/DD/YYYY (US) first; if invalid, fall back below
      const candidate = new Date(`${c}-${pad(a)}-${pad(b)}`);
      if (!isNaN(candidate.getTime())) return formatDate(candidate);
      // fallback to DD/MM/YYYY
      const swapped = new Date(`${c}-${pad(b)}-${pad(a)}`);
      if (!isNaN(swapped.getTime())) return formatDate(swapped);
    }
  }
  // Last resort: let JS try to parse; if valid produce YYYY-MM-DD
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return formatDate(new Date(parsed));
  return null;
};

/**
 * @returns The birth date as YYYY-MM-DD, or null if it can't be parsed or is outside 7–100 years ago.
 */
export function normalizeBirth(birth: unknown): string | null {
  let birthString = "";

  if (typeof birth === 'number') {
    const d = new Date(birth);
    if (!isNaN(d.getTime())) birthString = formatDate(d);
  } else if (birth instanceof Date) {
    if (!isNaN(birth.getTime())) birthString = formatDate(birth);
  } else if (typeof birth === 'string') {
    const normalized = tryParseDate(birth);
    if (normalized) birthString = normalized;
  }

  // Validate final YYYY-MM-DD and logical range
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthString)) return null;
  const birthDate = new Date(birthString);
  if (isNaN(birthDate.getTime())) return null;
  const now = new Date();
  const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
  const sevenYearsAgo = new Date(now.getFullYear() - 7, now.getMonth(), now.getDate());
  if (birthDate < hundredYearsAgo || birthDate > sevenYearsAgo) return null;

  return birthString;
}

/**
 * @returns The trimmed phone number, or null if it isn't a plausible phone number.
 */
export function normalizePhone(phone: unknown): string | null {
  const phoneString = typeof phone === 'string' ? phone.trim() : '';
  // Allow formatting like "+49 (0) 151 1234 5678"; check the digit count separately (E.164 max is 15, +1 for a "(0)" trunk prefix)
  const phoneDigits = phoneString.replace(/\D/g, '').length;
  if (!/^\+?[0-9][0-9\s()-]{5,29}$/.test(phoneString) || phoneDigits < 6 || phoneDigits > 16) {
    return null;
  }
  return phoneString;
}

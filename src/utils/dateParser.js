const MONTHS = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

/**
 * Parses human schedule strings like "20th Dec 2026" into reliable ISO+05:30 Dates
 * (Safari-safe and IST-pinned: test window 5:30 PM – 11:30 PM IST).
 */
export function parseTestWindow(dateString) {
  if (!dateString || typeof dateString !== "string") return null;

  const cleaned = dateString
    .trim()
    .replace(/(\d+)(st|nd|rd|th)/i, "$1")
    .replace(/,/g, "");

  const parts = cleaned.split(/\s+/);
  if (parts.length < 3) return null;

  const day = String(parseInt(parts[0], 10)).padStart(2, "0");
  const month = MONTHS[parts[1].toLowerCase()];
  const year = parts[2];

  if (!month || !/^\d{4}$/.test(year) || Number.isNaN(Number(day))) {
    const fallbackStart = new Date(`${cleaned} 17:30:00`);
    const fallbackEnd = new Date(`${cleaned} 23:30:00`);
    if (Number.isNaN(fallbackStart.getTime())) return null;
    return { start: fallbackStart, end: fallbackEnd };
  }

  return {
    start: new Date(`${year}-${month}-${day}T17:30:00+05:30`),
    end: new Date(`${year}-${month}-${day}T23:30:00+05:30`),
  };
}

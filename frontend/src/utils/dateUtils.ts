// Utilities to map real Date objects to the legacy game date representation (week/month/year)

export interface GameDate {
  week: number;
  month: number;
  year: number;
}

// Converts a real Date to a GameDate based on the provided startDate (career start).
// Rules preserved from earlier code: 48 weeks/year, 4 weeks/month => 12 months/year.
export const toGameDate = (date: Date, startDate: Date): GameDate => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / msPerDay);
  const weeksSinceStart = Math.floor(daysSinceStart / 7);

  const weekIndex = weeksSinceStart; // 0-based
  const year = Math.floor(weekIndex / 48) + 1;
  const weekOfYear = (weekIndex % 48) + 1; // 1..48
  const month = Math.floor((weekOfYear - 1) / 4) + 1; // 1..12
  const week = ((weekOfYear - 1) % 4) + 1; // 1..4

  return { week, month, year };
};

// Converts a GameDate back to an approximate Date relative to startDate (returns start of the week)
export const fromGameDate = (g: GameDate, startDate: Date): Date => {
  const totalWeeks = (g.year - 1) * 48 + (g.month - 1) * 4 + (g.week - 1); // 0-based weeks
  const d = new Date(startDate);
  d.setDate(d.getDate() + totalWeeks * 7);
  return d;
};

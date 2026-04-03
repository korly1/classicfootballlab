/** Approximate age in full years from calendar birth year (Jan 1 basis). */
export function ageFromBirthYear(birthYear: number | null): number | null {
  if (birthYear === null || !Number.isFinite(birthYear)) return null;
  const y = new Date().getFullYear();
  return y - birthYear;
}

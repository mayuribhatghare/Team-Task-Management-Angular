// ✅ Fix: E extends object
export function enumToOptions<E extends object>(
  e: E
): { value: number; label: string }[] {
  return Object.keys(e)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: (e as any)[key]
    }));
}

export function toEnumValue<E extends object>(
  e: E,
  str: string | number
): number {
  if (typeof str === 'number') return str;
  return (e as any)[str as keyof typeof e] ?? null;
}

export function toEnumString<E extends object>(e: E, value: number): string {
  return Object.keys(e).find((k) => (e as any)[k] === value) ?? '';
}
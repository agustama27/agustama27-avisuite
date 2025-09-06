export function isPlainObject(v: any) {
  return v && typeof v === "object" && !Array.isArray(v);
}

export function humanKey(k: string) {
  return k
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatValue(v: any) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return Number.isInteger(v) ? v.toString() : v.toFixed(2);
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return JSON.stringify(v);
}

export function objectToRows(obj: any): { key: string; val: string }[] {
  return Object.keys(obj || {}).map((k) => ({ key: humanKey(k), val: formatValue(obj[k]) }));
}

export function arrayToTable<T extends Record<string, any>>(arr: T[]) {
  const columns = Array.from(
    new Set(arr.flatMap((r) => Object.keys(r ?? {})))
  );
  return {
    columns,
    rows: arr.map((r) => columns.map((c) => formatValue(r?.[c]))),
  };
}

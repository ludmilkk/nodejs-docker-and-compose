export function normalize(str: string): string {
  return typeof str === 'string' ? str.trim().toLowerCase() : undefined;
}

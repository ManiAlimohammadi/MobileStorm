export function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).toUpperCase().slice(2, 10).padEnd(8, "0");
  return `EW-${year}-${random}`;
}

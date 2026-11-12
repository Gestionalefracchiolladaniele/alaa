/* Piccole utilita' per i testi dei contenuti. */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Converte *parola* in <em>parola</em> (enfasi del PDF, es. "black, silver, and gold"). */
export function inline(s: string): string {
  return esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

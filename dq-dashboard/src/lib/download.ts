/** Offers a CSV to the viewer. Returns a short message for a toast. */
export async function saveCSV(filename: string, csv: string): Promise<{ ok: boolean; text: string }> {
  const data = '﻿' + csv; // BOM so Excel reads accents correctly
  if (window.claude?.use) {
    const dl = await window.claude.use('downloads');
    if (!dl) return { ok: false, text: 'Downloads are not available in this view.' };
    try {
      await dl.save({ filename, data });
      return { ok: true, text: 'Spreadsheet saved' };
    } catch (e: any) {
      if (e?.code === 'declined') return { ok: false, text: 'Download cancelled' };
      if (e?.code === 'rate_limited') return { ok: false, text: 'A download is already waiting for you to confirm.' };
      return { ok: false, text: 'Downloads are not available in this view.' };
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
  a.download = filename;
  a.click();
  return { ok: true, text: 'Spreadsheet saved' };
}

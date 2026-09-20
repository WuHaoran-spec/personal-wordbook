import test from "node:test";
import assert from "node:assert/strict";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
function pdf(content) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let data = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((o, i) => {
    offsets.push(data.length);
    data += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const start = data.length;
  data +=
    "xref\n0 6\n0000000000 65535 f \n" +
    offsets
      .slice(1)
      .map((n) => String(n).padStart(10, "0") + " 00000 n \n")
      .join("");
  data += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return new TextEncoder().encode(data);
}
test("PDF.js extracts words from actual PDF bytes", async () => {
  const task = getDocument({
    data: pdf(
      "BT /F1 16 Tf 60 720 Td (unforgettable) Tj 0 -25 Td (reconnect) Tj ET",
    ),
    useSystemFonts: true,
  });
  try {
    const doc = await task.promise;
    const content = await (await doc.getPage(1)).getTextContent();
    const text = content.items
      .filter((i) => "str" in i)
      .map((i) => i.str)
      .join(" ");
    assert.match(text, /unforgettable/);
    assert.match(text, /reconnect/);
  } finally {
    await task.destroy();
  }
});
test("blank PDF produces no text and can be identified for OCR guidance", async () => {
  const task = getDocument({ data: pdf("") });
  try {
    const doc = await task.promise;
    const content = await (await doc.getPage(1)).getTextContent();
    assert.equal(content.items.length, 0);
  } finally {
    await task.destroy();
  }
});

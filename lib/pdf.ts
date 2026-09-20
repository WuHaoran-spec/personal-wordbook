import { extractCandidates } from "./wordbook";
export async function readPdf(file: File): Promise<string[]> {
  if (file.size > 20 * 1024 * 1024)
    throw new Error("PDF 请小于 20 MB；较大的文件请拆分后导入。");
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });
  let pdf;
  try {
    pdf = await task.promise;
    if (pdf.numPages > 200)
      throw new Error("一次最多读取 200 页，请拆分 PDF。");
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      let text = "";
      let lastY: number | undefined;
      for (const item of content.items) {
        if (!("str" in item)) continue;
        const y = item.transform[5];
        if (lastY !== undefined && Math.abs(y - lastY) > 3) text += "\n";
        text += item.str + (item.hasEOL ? "\n" : " ");
        lastY = item.hasEOL ? undefined : y;
      }
      pages.push(text);
      page.cleanup();
    }
    if (!pages.join("").trim())
      throw new Error(
        "这份 PDF 没有可提取的文字，可能是扫描件。请先用 OCR 转成可复制文字的 PDF。",
      );
    return pages;
  } catch (e) {
    if (e instanceof Error && e.name === "PasswordException")
      throw new Error("PDF 有密码保护，请先解锁后导入。");
    throw e;
  } finally {
    await task.destroy();
  }
}
export { extractCandidates };

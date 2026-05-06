import { type TotalResult } from "../types/crafting";

export const copyToClipboard = async (
  results: TotalResult[],
  selectedItem: string,
  quantity: number,
): Promise<boolean> => {
  if (results.length === 0) return false;

  // eslint-disable-next-line no-useless-escape
  const header = ` ---Raw Materials for ${quantity} x ${selectedItem}--- \n\n`;
  const body = results
    .map((r) => `${r.material} - (${r.category}): ${r.totalCount}`)
    .join("\n");

  const fullText = header + body;
  try {
    await navigator.clipboard.writeText(fullText);
    return true;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
};

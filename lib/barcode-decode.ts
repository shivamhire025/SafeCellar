import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

export async function decodeBarcodeFromImageFile(file: File): Promise<string> {
  const reader = new BrowserMultiFormatReader();
  const url = URL.createObjectURL(file);
  try {
    const result = await reader.decodeFromImageUrl(url);
    return result.getText();
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw new Error(
        "No barcode found in this image. Try a clearer photo with the barcode in frame."
      );
    }
    throw new Error("Could not read barcode from image. Try another photo.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

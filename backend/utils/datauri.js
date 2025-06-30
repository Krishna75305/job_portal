import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

export function getDatauri(file) {
  if (!file || !file.originalname || !file.buffer) {
    return null; // ✅ Safely return null if any required part is missing
  }

  return parser.format(path.extname(file.originalname), file.buffer);
}

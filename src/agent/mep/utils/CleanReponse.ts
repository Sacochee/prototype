export default function cleanResponse(string: string): string {
  if (string.startsWith("```json")) {
    return string.slice(7, -3);
  } else return string;
}

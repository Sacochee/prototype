export default function toPt(str: string) {
  if (!str) return 0;
  const match = /^([\d.]+)(px|pt|em|rem|cm|mm)?$/i.exec(str.trim());
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = (match[2] || "px").toLowerCase();

  switch (unit) {
    case "pt":
      return value;
    case "px":
      return value * 0.75; // 1px = 0.75pt
    case "pc":
      return value * 12; // 1pc = 12pt
    case "in":
      return value * 72; // 1in = 72pt
    case "cm":
      return value * 28.3465; // 1cm = 28.3465pt
    case "mm":
      return value * 2.83465; // 1mm = 2.83465pt
    default:
      return null;
  }
}

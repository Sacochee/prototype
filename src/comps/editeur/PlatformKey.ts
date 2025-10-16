export default function (key: string) {
  const platform = navigator.platform.toLowerCase();
  const isMac = platform.includes("mac");

  if (key === "Mod") {
    return isMac ? "⌘" : "Ctrl";
  } else if (key === "Shift") return "Maj";

  return key;
}

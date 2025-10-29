export const CleanHtmlString = (str: string): string =>
  str.replaceAll(/\s*style="[^"]*"/gi, "").replaceAll(/<\/?span[^>]*>/gi, "");


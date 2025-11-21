export const encodeBase64 = (text: string): string => {
  return btoa(encodeURIComponent(text));
};

export const decodeBase64 = (encoded: string): string => {
  return decodeURIComponent(atob(encoded));
};
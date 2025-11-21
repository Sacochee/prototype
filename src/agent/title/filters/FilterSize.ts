const MAX_TITLE_SIZE = 500;
export default function (lst: any[]): any[] {
  const liste: any[] = [];
  for (const item of lst) {
    if (item.text.length <= MAX_TITLE_SIZE) {
      liste.push(item);
    }
  }

  return liste;
}

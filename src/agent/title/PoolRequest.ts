import TokenCount from "../mep/utils/TokenCount";

export default async function runPool(
  fnc: (arg: any, token: TokenCount) => Promise<any>,
  data: any[],
  token: TokenCount,
  limit = 3
) {
  const results: any[] = [];
  const executing: Promise<void>[] = [];

  // fonction interne avec retry
  async function tryRun(item: any, attempt = 1): Promise<any> {
    try {
      const res = await fnc(item, token);
      return JSON.parse(JSON.stringify(res)); // force JSON structure
    } catch (err) {
      if (attempt < 3) {
        console.warn(`Retry ${attempt} for item`, err);
        return tryRun(item, attempt + 1);
      } else {
        console.error("Skip item after 3 fails:", err);
        return null; // skip après 3 échecs
      }
    }
  }

  for (const item of data) {
    const p = tryRun(item)
      .then((r) => {
        if (r !== null) results.push(r);
      })
      .catch(() => {});
    executing.push(p);

    if (executing.length >= limit) await Promise.race(executing);
  }

  await Promise.all(executing);
  return results;
}

export default function (obj: Object, name: string) {
  if (process.env.NODE_ENV === "development")
    return { ...obj, "data-name": name };
  else return obj;
}

import { formUrl } from "./formUrl";

export const urlsAreEquals = (a: string, b: string) =>
  formUrl(a) === formUrl(b);

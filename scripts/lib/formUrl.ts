export const formUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}`;
  } finally {
    return url;
  }
};

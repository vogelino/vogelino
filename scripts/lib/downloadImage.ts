import fetch from "node-fetch";
import { logIndented } from "./logUtil";

export const downloadImage = async (
  url: string
): Promise<{
  imageExt: string;
  data: NodeJS.ReadableStream;
}> => {
  let timeoutExceeded = true;
  setTimeout(() => {
    if (timeoutExceeded) throw new Error(`Timout exceeded for file "${url}"`);
  }, 10000);
  const response = await fetch(url);
  timeoutExceeded = false;
  const contentType = response.headers.get("content-type");
  const imageExtensionMatch = contentType?.match(
    /^image\/(?<ext>\b[^\d\W]+\b)$/
  )?.groups;
  const imageExt = imageExtensionMatch?.ext;
  if (!imageExt)
    throw new Error(
      `The requested url was not an image (content-type: ${contentType})`
    );
  logIndented(`📄 The file is an image with the ".${imageExt}" extension`);

  return {
    imageExt,
    data: response.body,
  };
};

// export const downloadFile = (url: string, path: string) =>
//   new Promise((resolve, reject) => {
//     request.head(url, (err: string, res) => {
//       if (err) return reject(err);
//       request.get({ uri: url }, (error, fileServerResponse, body) => {
//         if (error) return reject(error);
//         const contentType = fileServerResponse.headers["content-type"];
//         const imageExtensionMatch = contentType?.match(
//           /^image\/(?<ext>\b[^\d\W]+\b)$/
//         )?.groups;
//         const imageExt = imageExtensionMatch?.ext;
//         if (!imageExt)
//           return reject(
//             `The requested url was not an image (content-type: ${contentType})`
//           );
//         const fullPath = `${path}.${imageExt}`;
//         fs.writeFile(fullPath, Buffer.from(body), "base64", (imgErr) => {
//           if (imgErr) return reject(imgErr);
//           resolve(fullPath);
//         });
//       });
//     });
//   });

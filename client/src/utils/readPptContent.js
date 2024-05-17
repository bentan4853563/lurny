import pptxParser from "pptx-parser";

export const readPptContent = (file) => {
  return new Promise((resolve, reject) => {
    pptxParser
      .parsePPTX(file)
      .then((content) => {
        // You will need to process the parsed result to concatenate strings
        resolve(content);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

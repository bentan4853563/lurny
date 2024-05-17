import { PDFExtract } from "pdf.js-extract";
const pdfExtract = new PDFExtract();
const options = {}; /* see below */
pdfExtract
  .extract("test.pdf", options)
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

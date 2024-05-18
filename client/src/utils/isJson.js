export const isValidJSON = (text) => {
  try {
    JSON.parse(text); // Attempt to parse the text as JSON
    return true; // If it succeeds, the text is valid JSON
  } catch (error) {
    return false; // If it fails, the text is not valid JSON
  }
};

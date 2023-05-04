export default function computeStringSimilarity(str1, str2) {
  const longer = str1.length >= str2.length ? str1 : str2;
  const shorter = str1.length < str2.length ? str1 : str2;

  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }

  const distance = computeLevenshteinDistance(longer, shorter);
  const similarity = (longerLength - distance) / parseFloat(longerLength);

  return similarity;
}

function computeLevenshteinDistance(str1, str2) {
  const matrix = [];

  const rowLength = str1.length + 1;
  const colLength = str2.length + 1;

  for (let i = 0; i < rowLength; i++) {
    matrix.push([i]);
  }

  for (let j = 1; j < colLength; j++) {
    matrix[0].push(j);
  }

  for (let i = 1; i < rowLength; i++) {
    for (let j = 1; j < colLength; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[rowLength - 1][colLength - 1];
}

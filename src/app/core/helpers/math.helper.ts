/**
 * Calcula el promedio de un array de números.
 */
export function calculateAverage(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return sum / values.length;
}

/**
 * Calcula la desviación estándar de población de un array de números.
 */
export function calculateStandardDeviation(
  values: number[],
  average?: number,
): number {
  if (!values || values.length === 0) return 0;

  const avg = average !== undefined ? average : calculateAverage(values);
  const sumOfSquaredDifferences = values.reduce((acc, val) => {
    const difference = val - avg;
    return acc + difference * difference;
  }, 0);

  const variance = sumOfSquaredDifferences / values.length;
  return Math.sqrt(variance);
}

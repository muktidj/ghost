export function customCeiling(price: number): number {
  // Always round up the price
  let adjustedPrice = Math.ceil(price);

  // Determine the remainder when divided by 1,000
  const remainder = adjustedPrice % 1000;

  if (remainder >= 0 && remainder <= 10) {
    // If the remainder is between 1 and 10, set the thousands place to zero
    adjustedPrice -= remainder;
  } else if (remainder >= 10 && remainder <= 1000) {
    adjustedPrice = adjustedPrice - remainder + 1000;
  }

  return adjustedPrice;
}

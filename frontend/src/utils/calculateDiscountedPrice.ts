export function calculateDiscountedPrice(
  originalPrice: number,
  discount: number,
  isPercentage: boolean = true
): number {
  if (isPercentage) {
    return originalPrice - (originalPrice * discount) / 100;
  } else {
    return originalPrice - discount;
  }
}

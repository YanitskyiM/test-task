export const getTrialFormattedPrice = (price: number, currency: string) => {
  const priceFixed = (price / 100).toFixed(2);

  return currencyMap[currency] + priceFixed;
};

export const getAnnualFormattedPrice = (price: number, currency: string) => {
  const priceFixed = (price / 100 / 12).toFixed(2);

  if (price === 19900) { // todo magic number
    return `€${priceFixed}`;
  }

  return currencyMap[currency] + priceFixed;
};

export const currencyMap = {
  USD: "$",
  GBP: "£",
  EUR: "€",
};

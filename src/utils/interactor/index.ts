export const getTrialFormattedPrice = (price: number, currency: string) => {
  const priceFixed = (price / 100).toFixed(2);
  const currencySymbol = getCurrency(currency);

  return currencySymbol + priceFixed;
};

export const getAnnualFormattedPrice = (price: number, currency: string) => {
  const priceFixed = (price / 100 / 12).toFixed(2);
  const currencySymbol = getCurrency(currency);

  if (price === 19900) {
    return `€${priceFixed}`;
  }

  return currencySymbol + priceFixed;
};

export const getCurrency = (currency: string) => {
  if (currency === "USD") {
    return "$";
  }

  if (currency === "GBP") {
    return "£";
  }

  return "€";
};

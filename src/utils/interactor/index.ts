export const getTrialFormattedPrice = (price: number, currency: string) => {
    if (currency === "USD") {
        return `$${price / 100}`;
    }

    if (currency === "GBP") {
        return `£${price / 100}`;
    }

    return `€${price / 100}`;
};

export const getAnnualFormattedPrice = (price: number, currency: string) => {
    if (price === 19900) {
        return `€${price / 100 / 12}`;
    }
    if (currency === "USD") {
        return `$${price / 100 / 12}`;
    }

    if (currency === "GBP") {
        return `$${price / 100 / 12}`;
    }
    return `€${price / 100 / 12}`;
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
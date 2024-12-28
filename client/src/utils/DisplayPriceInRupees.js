export const DisplayPriceInRupees = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// export const DisplayPrice = (price, currency = "USD") => {
//   const currencyFormatMap = {
//     BDT: "en-BD",
//     USD: "en-US",
//     INR: "en-IN",
//   };

//   const locale = currencyFormatMap[currency] || "en-US";

//   return new Intl.NumberFormat(locale, {
//     style: "currency",
//     currency: currency,
//   }).format(price);
// };

// DisplayPrice(123456, "BDT");

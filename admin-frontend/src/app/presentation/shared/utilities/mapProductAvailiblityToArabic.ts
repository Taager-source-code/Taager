const mapProductAvailiblityToArabic = (productAvailiblityStatus) => {
  if (productAvailiblityStatus === "available_with_high_qty") {
    return "متوفر بكمية كبيرة";
  } else if (productAvailiblityStatus === "available") {
    return "متوفر";
  } else if (productAvailiblityStatus === "available_with_low_qty") {
    return "متوفر بكمية محدودة";
  } else if (productAvailiblityStatus === "not_available") {
    return "غير متوفر";
  } else {
    return "";
  }
};
export default mapProductAvailiblityToArabic;
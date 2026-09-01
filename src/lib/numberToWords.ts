export function numberToIndianWords(num: number): string {
  if (isNaN(num) || num === 0) return "Rupees Zero Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n: number): string {
    if (n === 0) return "";
    if (n < 20) return a[n] + " ";
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "") + " ";
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + "Thousand " + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + "Lakh " + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + "Crore " + inWords(n % 10000000);
  }

  const whole = Math.floor(Math.abs(num));
  const fraction = Math.round((Math.abs(num) - whole) * 100);

  let result = "Rupees " + inWords(whole).trim();
  if (fraction > 0) {
    result += " and " + inWords(fraction).trim() + " Paise";
  }
  result += " Only";

  return result.replace(/\s+/g, " ");
}

export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
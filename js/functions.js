let checkStringLength = (str,maxLength) =>{
  return str.length <= maxLength;
}
console.log(checkStringLength('проверяемая строка', 20));//true
console.log(checkStringLength('проверяемая строка', 18)); // true
console.log(checkStringLength('проверяемая строка', 10)); // false

let isPalindrome = (str) =>{
  let cleanStr = str.replaceAll(' ', '').toLowerCase();
  const length = cleanStr.length;
  let newStr = '';
  for (let i = length-1; i>=0 ; i--){
    newStr += cleanStr[i];
  }
  return newStr === cleanStr;
}
console.log(isPalindrome('топот'));//true
console.log(isPalindrome('ДовОд')); // true
console.log(isPalindrome('Кекс'));  // false
console.log(isPalindrome('Лёша на полке клопа нашёл ')); // true

let extractDigits = (str) =>{
  if (typeof str === 'number') {
    str = str.toString();
  }

  let digits = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const num = parseInt(char, 10);
    if (!Number.isNaN(num) && char >= '0' && char <= '9') {
      digits += char;
    }
  }
  if (digits.length > 0) {
    return parseInt(digits, 10);
  }
  return NaN;
}
console.log(extractDigits("abc123def"));    // 123
console.log(extractDigits("a1b2c3"));       // 123
console.log(extractDigits("hello"));        // NaN
console.log(extractDigits(""));             // NaN
console.log(extractDigits('1 кефир, 0.5 батона')); // 105
console.log(extractDigits(2023)); //2023

const checkStringLength = (string, length) => string.length <= length;
checkStringLength('проверяемая строка', 20);//true
checkStringLength('проверяемая строка', 18); // true
checkStringLength('проверяемая строка', 10); // false

const isPalindrome = (str) =>{
  const cleanStr = str.replaceAll(' ', '').toLowerCase();
  const length = cleanStr.length;
  let newStr = '';
  for (let i = length-1; i>=0 ; i--){
    newStr += cleanStr[i];
  }
  return newStr === cleanStr;
};
isPalindrome('топот');//true
isPalindrome('ДовОд'); // true
isPalindrome('Кекс');  // false
isPalindrome('Лёша на полке клопа нашёл '); // true

const extractDigits = (str) =>{
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
};
extractDigits('abc123def');    // 123
extractDigits('a1b2c3');       // 123
extractDigits('hello');        // NaN
extractDigits('');             // NaN
extractDigits('1 кефир, 0.5 батона'); // 105
extractDigits(2023); //2023

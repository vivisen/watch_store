//! -------------------FIRST CHALLENGE----------------
// const foo = (word) => {
//   const toArray = word.split("").map(i => i.toLowerCase());
//   const bar = [];
//   toArray.map((w) => {
//     bar.push(`${toArray.indexOf(w)}-${toArray.lastIndexOf(w)}`);
//   });
//   const fuck = bar.map((i) => {
//     if (i[0] !== i[2]) {
//       return ")";
//     }
//     return "(";
//   });
//   return fuck.join("");
// };

// console.log(foo(")) @"));

//! -----------------SECOND CHALLENGE----------------------
// const friend = (friends) => {
//   return friends.filter((f) => {
//     if (f.length === 4) return f;
//   });
// };

// console.log(friend(["fuck", "alireza", "you", "your"]));

//! -----------------THRID CHALLENGE----------------------
// const validPin = (pin) => {
//   const toArr = pin.split("");
//   if (toArr.length === 4 || toArr.length === 6) {
//     return toArr.every((i) => {
//       return isNaN(i) === false && i !== " ";
//     });
//   }
//   return false;
// };

//! ---------PAGINATIONS------------
// const createPaginations = (productsLength, perPage) => {
//   const endIndex = Math.ceil(productsLength / perPage);
//   const foo = [];
//   for (let i = 1; i <= endIndex; i++) {
//     foo.push(i);
//   }
// };

// createPaginations(12, 6);

//! -------------TASKIFY---------
//* my answer
// const taskify = (cc) => {
//   const toArray = cc.split("");
//   if (toArray.length > 4) {
//     return toArray.fill("#", 0, toArray.length - 4).join("");
//   }
//   return cc;
// };
// console.log(taskify("11111"));
//* Best answer from code wars
// function maskify(cc) {
//   return cc.slice(0, -4).replace(/./g, "#") + cc.slice(-4);
// }

//! Find outlier number
//* My Answer and top solution from code wars
// const find_out_lier = (integers) => {
//   const odds = integers.filter((i) => i % 2 !== 0);
//   const evens = integers.filter((i) => i % 2 === 0);
//   const which = odds.length > evens.length;
//   return which ? evens[0] : odds[0];
// };
// console.log(find_out_lier([160, 3, 1719, 19, 11, 13, -21]));

//! IQ Test
//* My Answer
// const getSum = (a, b) => {
//   const numbers = [];
//   if (a < b) {
//     for (let i = a; i <= b; i++) {
//       numbers.push(i);
//     }
//   } else if (a > b) {
//     for (let i = a; i >= b; i--) {
//       numbers.push(i);
//     }
//   } else {
//     return a;
//   }
//   return numbers.reduce((x, y) => x + y, 0);
// };
// console.log(getSum(-151, -99));
//* Best answer from code wars
// const GetSum = (a, b) => {
//     let min = Math.min(a, b);
//     let  max = Math.max(a, b);
//     return (max - min + 1) * (min + max) / 2;
//   }

//! --------------SPIN WORDS-----------
//* My asnwer
// function spinWords() {
//   const toArray = arguments[0].split(" ");
//   const reversing = toArray.map((word) => {
//     if (word.length >= 5) {
//       return reverseString(word);
//     }
//     return word;
//   });
//   return reversing.join(" ");
// }
// function reverseString(string) {
//   if (string === "") return "";
//   return reverseString(string.substr(1)) + string.charAt(0);
// }
// console.log(spinWords("This is alireza darvishi"));
//* Best answer from code wars
// function spinWords(words) {
//   return words
//     .split(" ")
//     .map(function (word) {
//       return word.length > 4 ? word.split("").reverse().join("") : word;
//     })
//     .join(" ");
// }

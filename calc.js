// @ts-check
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function sumAll() {
  let sum = 0;
  // for
  //   for (let i = 0; i < arr.length; i++) {
  //     sum = sum + arr[i];
  //   }

  //  reduce
  sum = arr.reduce((acc, num) => acc + num);
  return sum;
}
// console.log(sumAll);
export { arr, sumAll };

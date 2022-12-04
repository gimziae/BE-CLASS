// @ts-check

const arr = [1, 2, 3, 4, 5, 6];

function spread(first, second, ...rest) {
  console.log(first, second);

  console.log(rest);
}
spread(1, 2, 3, 4, 5);

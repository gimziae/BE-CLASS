// @ts-check
const animals = ['dog', 'cat', 'pig'];

function showAnimals() {
  animals.map((el) => console.log(el));
}

export { animals as ani, showAnimals as show };

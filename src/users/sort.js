export default function sort(firstElement, secondElement, key, direction) {
  const directionIsAsc = direction === 'asc';

  if (firstElement[key].value > secondElement[key].value) {
    return directionIsAsc ? 1 : -1;
  }
  if (firstElement[key].value < secondElement[key].value) {
    return directionIsAsc ? -1 : 1;
  }
  return 0;
}

/**
 * Given a keyed value from an element on the table, returns its internal value for sorting if it exists.
 * This lets us properly support course ids that are embedded in links, as well as other objects.
 */
function getInternalValue(keyedValue) {
  if (keyedValue) {
    const { props = {} } = keyedValue;
    return props.children;
  }
  return undefined;
}

export default function sort(firstElement, secondElement, key, direction) {
  const directionIsAsc = direction === 'asc';

  const firstKeyedValue = firstElement[key];
  const firstInternalValue = getInternalValue(firstKeyedValue);
  const secondKeyedValue = secondElement[key];
  const secondInternalValue = getInternalValue(secondKeyedValue);

  if (firstKeyedValue > secondKeyedValue || firstInternalValue > secondInternalValue) {
    return directionIsAsc ? 1 : -1;
  }
  if (firstKeyedValue < secondKeyedValue || firstInternalValue < secondInternalValue) {
    return directionIsAsc ? -1 : 1;
  }
  return 0;
}

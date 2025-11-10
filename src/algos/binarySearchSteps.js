export function binarySearchSteps(arr, target) {
  let steps = [];
  let low = 0, high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push({ type: "check", low, mid, high });

    if (arr[mid] === target) {
      steps.push({ type: "found", index: mid });
      break;
    } else if (arr[mid] < target) {
      steps.push({ type: "moveRight", mid });
      low = mid + 1;
    } else {
      steps.push({ type: "moveLeft", mid });
      high = mid - 1;
    }
  }

  steps.push({ type: "done" });
  return steps;
}

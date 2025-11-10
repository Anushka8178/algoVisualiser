export function heapSortSteps(arr) {
  const actions = [];
  const array = [...arr];
  const n = array.length;

  function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      actions.push({ type: "compare", indices: [left, largest], array: [...arr] });
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      actions.push({ type: "compare", indices: [right, largest], array: [...arr] });
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      actions.push({ type: "swap", indices: [i, largest], array: [...arr] });
      heapify(arr, n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    actions.push({ type: "buildHeap", index: i, array: [...array] });
    heapify(array, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    actions.push({ type: "extractMax", index: i, array: [...array] });
    actions.push({ type: "markSorted", index: i, array: [...array] });
    heapify(array, i, 0);
  }

  actions.push({ type: "markSorted", index: 0, array: [...array] });
  actions.push({ type: "done", array: [...array] });

  return actions;
}


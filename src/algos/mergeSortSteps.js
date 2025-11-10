export function mergeSortSteps(arr) {
  const actions = [];
  const array = [...arr];
  const n = array.length;

  function merge(left, mid, right) {
    // Create temporary arrays
    const leftArr = [];
    const rightArr = [];
    
    for (let i = left; i <= mid; i++) {
      leftArr.push(array[i]);
    }
    for (let i = mid + 1; i <= right; i++) {
      rightArr.push(array[i]);
    }

    actions.push({
      type: "mergeStart",
      left,
      mid,
      right,
      array: [...array],
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      // Compare elements from left and right subarrays
      const leftIdx = left + i;
      const rightIdx = mid + 1 + j;
      
      actions.push({
        type: "compare",
        indices: [leftIdx, rightIdx],
        array: [...array],
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        actions.push({
          type: "mergeMove",
          from: leftIdx,
          to: k,
          value: leftArr[i],
          array: [...array],
        });
        i++;
      } else {
        array[k] = rightArr[j];
        actions.push({
          type: "mergeMove",
          from: rightIdx,
          to: k,
          value: rightArr[j],
          array: [...array],
        });
        j++;
      }
      k++;
    }

    // Copy remaining elements from leftArr
    while (i < leftArr.length) {
      array[k] = leftArr[i];
      actions.push({
        type: "mergeMove",
        from: left + i,
        to: k,
        value: leftArr[i],
        array: [...array],
      });
      i++;
      k++;
    }

    // Copy remaining elements from rightArr
    while (j < rightArr.length) {
      array[k] = rightArr[j];
      actions.push({
        type: "mergeMove",
        from: mid + 1 + j,
        to: k,
        value: rightArr[j],
        array: [...array],
      });
      j++;
      k++;
    }

    actions.push({
      type: "mergeComplete",
      left,
      right,
      array: [...array],
    });
  }

  function mergeSort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      actions.push({
        type: "divide",
        left,
        mid,
        right,
        array: [...array],
      });

      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      merge(left, mid, right);
    } else if (left === right) {
      actions.push({
        type: "baseCase",
        index: left,
        array: [...array],
      });
    }
  }

  if (array.length > 0) {
    mergeSort(0, array.length - 1);
  }

  // Mark all as sorted at the end
  actions.push({
    type: "done",
    array: [...array],
  });

  return actions;
}

export function insertionSortSteps(arr) {
  const actions = [];
  const array = [...arr];
  const n = array.length;

  // Mark first element as sorted (trivially sorted)
  if (n > 0) {
    actions.push({
      type: "markSorted",
      index: 0,
      array: [...array],
    });
  }

  // Insertion sort steps
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    // Mark the key element being inserted
    actions.push({ 
      type: "select", 
      index: i, 
      keyValue: key,
      array: [...array],
      message: `Selecting ${key} to insert into sorted portion`
    });

    // Move elements greater than key one position ahead
    while (j >= 0 && array[j] > key) {
      // Compare: show j (element we're checking) and j+1 (where key will go)
      actions.push({ 
        type: "compare", 
        indices: [j, j + 1], 
        keyValue: key,
        array: [...array],
        message: `Comparing ${array[j]} with ${key} (key) - ${array[j]} > ${key}, need to shift`
      });

      // Shift element to the right
      array[j + 1] = array[j];
      actions.push({ 
        type: "shift", 
        fromIndex: j, 
        toIndex: j + 1,
        keyValue: key,
        array: [...array],
        message: `Shifting ${array[j + 1]} from position ${j} to ${j + 1}`
      });

      j--;
    }

    // Insert the key at the correct position
    if (j + 1 !== i) {
      // Key needs to be moved
      array[j + 1] = key;
      actions.push({ 
        type: "insert", 
        index: j + 1,
        keyValue: key,
        array: [...array],
        message: `Inserting ${key} at position ${j + 1}`
      });
    } else {
      // Key was already in correct position (no shifts occurred)
      actions.push({ 
        type: "insert", 
        index: i,
        keyValue: key,
        array: [...array],
        message: `${key} is already in the correct position`
      });
    }
  }
  
  // Mark all elements as sorted at the end
  for (let k = 0; k < n; k++) {
    actions.push({
      type: "markSorted",
      index: k,
      array: [...array],
    });
  }

  actions.push({
    type: "done",
    array: [...array],
  });

  return actions;
}


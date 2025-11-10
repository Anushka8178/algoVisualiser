export function insertionSortSteps(arr) {
  const actions = [];
  const array = [...arr];
  const n = array.length;

  if (n > 0) {
    actions.push({
      type: "markSorted",
      index: 0,
      array: [...array],
    });
  }

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    actions.push({
      type: "select",
      index: i,
      keyValue: key,
      array: [...array],
      message: `Selecting ${key} to insert into sorted portion`
    });

    while (j >= 0 && array[j] > key) {

      actions.push({
        type: "compare",
        indices: [j, j + 1],
        keyValue: key,
        array: [...array],
        message: `Comparing ${array[j]} with ${key} (key) - ${array[j]} > ${key}, need to shift`
      });

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

    if (j + 1 !== i) {

      array[j + 1] = key;
      actions.push({
        type: "insert",
        index: j + 1,
        keyValue: key,
        array: [...array],
        message: `Inserting ${key} at position ${j + 1}`
      });
    } else {

      actions.push({
        type: "insert",
        index: i,
        keyValue: key,
        array: [...array],
        message: `${key} is already in the correct position`
      });
    }
  }

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


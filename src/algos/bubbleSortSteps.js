export function bubbleSortSteps(arr) {
    const actions = [];
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        actions.push({ type: "compare", indices: [j, j + 1], array: [...array] });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swapped = true;
          actions.push({ type: "swap", indices: [j, j + 1], array: [...array] });
        }
      }

      actions.push({
        type: "markSorted",
        index: n - i - 1,
        array: [...array],
      });

      if (!swapped) break;
    }

    for (let i = 0; i < n; i++) {
      actions.push({
        type: "markSorted",
        index: i,
        array: [...array],
      });
    }

    actions.push({
      type: "done",
      array: [...array],
    });

    return actions;
  }

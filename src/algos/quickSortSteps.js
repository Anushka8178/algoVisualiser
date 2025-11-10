export function quickSortSteps(arr) {
  const actions = [];
  const a = [...arr];

  function record(type, details) {
    actions.push({ type, ...details, array: [...a] });
  }

  function partition(low, high) {
    const pivot = a[high];
    record("pivot", { index: high });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      record("compare", { indices: [j, high] });
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        record("swap", { indices: [i, j] });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    record("swap", { indices: [i + 1, high] });
    record("markSorted", { index: i + 1 });
    return i + 1;
  }

  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }

  quickSort(0, a.length - 1);
  record("done", {});
  return actions;
}

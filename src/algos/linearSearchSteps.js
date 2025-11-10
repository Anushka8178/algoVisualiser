export function linearSearchSteps(arr, target) {
  let steps = [];

  for (let i = 0; i < arr.length; i++) {
    steps.push({ type: "check", index: i, value: arr[i] });

    if (arr[i] === target) {
      steps.push({ type: "found", index: i });
      break;
    } else {
      steps.push({ type: "notFound", index: i });
    }
  }

  if (!steps.some(s => s.type === "found")) {
    steps.push({ type: "done" });
  }

  return steps;
}


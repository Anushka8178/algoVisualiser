import { useEffect, useRef, useState } from "react";

export function usePlayer(actions = [], initialSpeed = 300) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const actionsRef = useRef(actions);

  useEffect(() => { actionsRef.current = actions; }, [actions]);

  useEffect(() => {
    if (!playing) return;
    if (index >= actionsRef.current.length - 1) {
      setPlaying(false);
      return;
    }

    const adjustedSpeed = Math.max(50, 1050 - speed);

    const t = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, actionsRef.current.length - 1));
    }, adjustedSpeed);

    return () => clearTimeout(t);
  }, [playing, index, speed]);

  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);
  const reset = () => { setPlaying(false); setIndex(0); };
  const stepForward = () => setIndex(i => Math.min(i + 1, actionsRef.current.length - 1));
  const stepBackward = () => setIndex(i => Math.max(0, i - 1));

  return { index, playing, play, pause, reset, stepForward, stepBackward, speed, setSpeed };
}

import { useEffect, useRef, useState } from "react";

export const useKeepStateAtLeast = <T>(ms: number, innerState: T) => {
  const prev = useRef<{ state: T; time: number }>({
    state: innerState,
    time: 0,
  });
  const [state, setState] = useState(innerState);

  useEffect(() => {
    if (prev.current.state === innerState) {
      setState(innerState);
      return;
    }

    // 状態が変化したときに、どのくらいの秒数状態を維持したかを求める
    const startTime = prev.current.time;
    const endTime = performance.now();

    const keepTime = endTime - startTime;
    if (keepTime < ms) {
      window.setTimeout(() => {
        setState(innerState);
        prev.current.time = performance.now();
      }, ms - keepTime);
    } else {
      setState(innerState);
      prev.current.time = performance.now();
    }

    prev.current.state = innerState;
  }, [innerState, ms]);

  return state;
};

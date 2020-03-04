import { useRef, useEffect } from "react";

export const useAnimationFrame = (callback: (dt: number) => void): void => {
  const callbackRef = useRef<(dt: number) => void>(callback);
  const frameRef = useRef<number>();
  const timerRef = useRef<number>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const loop = (time: number) => {
      frameRef.current = requestAnimationFrame(loop);

      let dt = 0;
      if (timerRef.current !== undefined && timerRef.current !== null)
        dt = time - timerRef.current;

      const callback = callbackRef.current;
      callback(dt / 1000); // We use seconds instead of millis, just because it's easier.

      timerRef.current = time;
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        // This is always set, but just in case, we check.
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
};

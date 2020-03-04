Heading
=======

Sub-heading
-----------

Paragraphs are separated
by a blank line.

Two spaces at the end of a line  
produces a line break.

Text attributes _italic_, 
**bold**, `monospace`.

Horizontal rule:

---

Strikethrough:
~~strikethrough~~

Bullet list:

  * apples
  * oranges
  * pears

Numbered list:

  1. lather
  2. rinse
  3. repeat

An [example](http://example.com).

![Image](https://upload.wikimedia.org/wikipedia/commons/5/5c/Icon-pictures.png)

> Markdown uses email-style > characters for blockquoting.

Inline <abbr title="Hypertext Markup Language">HTML</abbr> is supported.

```typescript
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
```
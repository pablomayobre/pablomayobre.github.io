import { useAnimationFrame } from "./hooks/useAnimationFrame";
import { useRef, MutableRefObject } from "react";
import { css } from "@emotion/core";

const COUNT = 128;
const COLORS = [
  "#FF9696",
  "#FFCF8C",
  "#F8FFAF",
  "#B1F7A3",
  "#AFD3FF",
  "#0ABAB5",
  "#FFBFCF",
  "#FDFD96",
  "#6BE4EA",
  "#B19CD9"
];

const EPSILON = 0.5; // half a pixel scroll doesn't require a redraw

interface State {
  scroll: number;
  particles: number[];
}

const initParticles = (ref: MutableRefObject<State | undefined>) => {
  const particles = [] as number[]; // length will be 5 * COUNT
  const depths = Array.from({ length: COUNT }, Math.random).sort(
    (a: number, b: number) => a - b
  );

  for (let i = 0; i < COUNT; i++) {
    // Each particle consists of 5 random values
    particles.push(depths[i]);
    particles.push(Math.random());
    particles.push(Math.random());
    particles.push(Math.random());
    particles.push(Math.random());
  }

  ref.current = {
    scroll: window.scrollY,
    particles
  };
};

const wrap = (m: number, n: number): number => {
  return n >= 0 ? n % m : ((n % m) + m) % m;
};

const particlesUpdate = (
  state: State,
  w: number,
  h: number,
  dt: number
): boolean => {
  const { scroll, particles } = state;

  const scrollDelta = window.scrollY - scroll;
  if (Math.abs(scrollDelta) < EPSILON) return false;

  state.scroll = window.scrollY;

  for (let i = 0; i < particles.length; i += 5) {
    const depth = particles[i];
    const y = particles[i + 2] - (scrollDelta / h) * 3 * depth;

    // Wrap the value so it's always in [0, 1] range
    particles[i + 2] = y >= 0 ? y % 1 : ((y % 1) + 1) % 1;
  }

  return true;
};

const drawParticles = (
  { particles: circles }: State,
  context: CanvasRenderingContext2D,
  w: number,
  h: number
) => {
  context.clearRect(0, 0, w, h);

  for (let i = 0; i < circles.length; i += 5) {
    const depth = circles[i];

    // This is all math used to turn the random values into useful stuff
    const r =
      (((circles[i + 3] * (2 + depth)) / 3) *
        Math.max(400, Math.min(w, h, 600))) /
      30;
    const x = circles[i + 1] * w;
    const y = circles[i + 2] * (h + 2 * r) - r;
    const color = Math.round(circles[i + 4] * COLORS.length);

    // Then we render that circle
    context.beginPath();
    context.fillStyle = COLORS[color];
    context.globalAlpha = (depth + 0.2) / 1.2;
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fill();
  }
};

const updateSize = (canvas: HTMLCanvasElement): [number, number, boolean] => {
  const w = window.innerWidth,
    h = window.innerHeight;
  let changed = false;

  if (canvas.width !== w) {
    canvas.width = w;
    changed = true;
  }
  if (canvas.height !== h) {
    canvas.height = h;
    changed = true;
  }

  return [w, h, changed];
};

export const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State>();

  useAnimationFrame(dt => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let [w, h, changed] = updateSize(canvas);

    if (!stateRef.current) {
      initParticles(stateRef);
      changed = true;
    }

    const state = stateRef.current;
    if (state && (particlesUpdate(state, w, h, dt) || changed)) {
      drawParticles(state, context, w, h);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
      `}
    ></canvas>
  );
};

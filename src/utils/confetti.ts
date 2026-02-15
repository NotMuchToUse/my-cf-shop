import confetti from "canvas-confetti";

export const successConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.2, y: 0.6 },
    colors: [
      "#26ccff",
      "#a25afd",
      "#ff5e7e",
      "#88ff5a",
      "#fcff42",
      "#ffa62d",
      "#ff36ff",
    ],
  });

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.8, y: 0.6 },
    colors: [
      "#26ccff",
      "#a25afd",
      "#ff5e7e",
      "#88ff5a",
      "#fcff42",
      "#ffa62d",
      "#ff36ff",
    ],
  });
};

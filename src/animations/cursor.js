// src/animations/cursor.js
import MouseFollower from "mouse-follower";
import gsap from "gsap";

MouseFollower.registerGSAP(gsap);

export default class Cursor {
  constructor() {
    this.init();
  }

  init() {
    // Sur mobile/tactile, inutile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    this.cursor = new MouseFollower({
      speed: 0.6,
      ease: "expo.out",
      skewing: 1.8,
      skewingDelta: 0.001,

      stateDetection: {
        "-pointer": "a, button, [data-cursor-pointer]",
        "-hidden": "iframe",
      },
    });

    this.createCursorEffects();
  }

  createCursorEffects() {
    // Pulse à l'entrée sur un élément "pointer"
    this.cursor.on("addState", (instance, state) => {
      if (state !== "-pointer") return;
      const el = instance?.el;
      if (!el) return;

      gsap.fromTo(
        el,
        { "--mf-pulse": 0 },
        { "--mf-pulse": 1, duration: 0.6, ease: "power2.out" }
      );
    });

    // Feedback au clic
    this.cursor.on("addState", (instance, state) => {
      if (state !== "-active") return;
      const el = instance?.el;
      if (!el) return;

      gsap.to(el, {
        scale: 0.85,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
      });
    });
  }
}

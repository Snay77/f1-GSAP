import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class Hero {
  constructor(container = document) {
    this.root = container;
    this.container = null;
    this.grid = null;

    this.triggers = [];
    this.tweens = [];

    this.init();
  }

  init() {
    this.setupElements();
    if (!this.container || !this.grid) return;
    this.createScrollAnimations();

    ScrollTrigger.refresh();
  }

  setupElements() {
    this.container = this.root.querySelector(".hero-f1");
    this.grid = this.root.querySelector(".hero-grid");
  }

  createScrollAnimations() {
    const pinTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      end: () => `+=${window.innerHeight * 2}px`,
      pin: true,
      pinSpacing: true,
    });
    this.triggers.push(pinTrigger);

    const tween = gsap.fromTo(
      this.grid,
      { scale: 2.5 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: this.grid,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}px`,
          scrub: true,
        },
      }
    );

    this.tweens.push(tween);
    if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
  }

  destroy() {
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];

    this.tweens.forEach((tw) => tw.kill());
    this.tweens = [];

    if (this.grid) gsap.set(this.grid, { clearProps: "transform" });

    this.container = null;
    this.grid = null;
  }
}
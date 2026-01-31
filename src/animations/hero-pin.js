import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class Hero {
  constructor(container = document) {
    this.root = container;           // ✅ scope Barba
    this.container = null;
    this.grid = null;

    this.triggers = [];
    this.tweens = [];

    this.init();
  }

  init() {
    this.setupElements();
    if (!this.container || !this.grid) return; // ✅ si pas sur la page, on sort
    this.createScrollAnimations();

    // ✅ important après injection DOM
    ScrollTrigger.refresh();
  }

  setupElements() {
    this.container = this.root.querySelector(".hero-f1");
    this.grid = this.root.querySelector(".hero-grid");
  }

  createScrollAnimations() {
    // Pin trigger
    const pinTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      end: () => `+=${window.innerHeight * 2}px`,
      pin: true,
      pinSpacing: true,
      // markers: true,
    });
    this.triggers.push(pinTrigger);

    // Zoom tween + scrollTrigger interne
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
          // markers: true,
        },
      }
    );

    this.tweens.push(tween);
    // récupère aussi le trigger créé par le tween
    if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
  }

  destroy() {
    // Kill triggers
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];

    // Kill tweens
    this.tweens.forEach((tw) => tw.kill());
    this.tweens = [];

    // Nettoie les styles inline
    if (this.grid) gsap.set(this.grid, { clearProps: "transform" });

    this.container = null;
    this.grid = null;
  }
}


// import gsap from "gsap";

// import { ScrollTrigger } from "gsap/ScrollTrigger";

// export default class Hero {
//     constructor() {
//         this.init();
//     }

//     init() {
//         gsap.registerPlugin(ScrollTrigger);

//         this.setupElements();

//         this.createScrollAnimations();
//     }

//     setupElements() {
//         this.container = document.querySelector(".hero-f1");
//         this.grid = document.querySelector(".hero-grid");
//     }

//     createScrollAnimations() {

//         this.createPinAnimation();

//         this.createAnimation();
//     }

//     createPinAnimation() {
//         ScrollTrigger.create({
//             trigger: this.container,
//             start: "top top",
//             end: `+=${window.innerHeight * 2}px`,
//             pin: true,
//             pinSpacing: true,
//         });

//     }

//     createAnimation() {

//         gsap.fromTo(
//             this.grid,
//             {
//                 scale: 2.5
//             },
//             {
//                 scale: 1,
//                 ease: "none",
//                 scrollTrigger: {
//                     trigger: this.grid,
//                     start: "top top",
//                     end: `+=${window.innerHeight * 2}px`,
//                     scrub: true,
//                     // markers: true,
//                 }
//             })

//     }

// }
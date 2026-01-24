import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class AboutAnimatedCopy {
  constructor() {
    this.elements = document.querySelectorAll("[data-animated-copy]");
    this.scrollTriggers = [];
    this.splits = [];
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    this.elements.forEach((el) => this.animate(el));
  }

  animate(el) {
    // Couleurs (variables CSS demandées + blanc en final)
    const colorInitial = el.dataset.colorInitial || "var(--f1-gray)";
    const colorAccent = el.dataset.colorAccent || "var(--f1-red)";
    const colorFinal = el.dataset.colorFinal || "#ffffff";

    // Split words then chars
    const wordSplit = new SplitText(el, {
      type: "words",
      wordsClass: "word",
    });

    const charSplit = new SplitText(wordSplit.words, {
      type: "chars",
      charsClass: "char",
    });

    const allChars = charSplit.chars;

    // stock pour cleanup
    this.splits.push(wordSplit, charSplit);

    let lastScrollProgress = 0;
    const colorTransitionTimers = new Map();
    const completedChars = new Set();

    gsap.set(allChars, { color: colorInitial });

    const scheduleFinalTransition = (char, index) => {
      if (colorTransitionTimers.has(index)) {
        clearTimeout(colorTransitionTimers.get(index));
      }

      const timer = setTimeout(() => {
        if (!completedChars.has(index)) {
          gsap.to(char, {
            duration: 0.12,
            ease: "none",
            color: colorFinal,
            onComplete: () => completedChars.add(index),
          });
        }
        colorTransitionTimers.delete(index);
      }, 110);

      colorTransitionTimers.set(index, timer);
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "top 25%",
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalChars = allChars.length;
        const isScrollingDown = progress >= lastScrollProgress;
        const currentCharIndex = Math.floor(progress * totalChars);

        allChars.forEach((char, index) => {
          // scroll up: reset les chars “après” la zone
          if (!isScrollingDown && index >= currentCharIndex) {
            if (colorTransitionTimers.has(index)) {
              clearTimeout(colorTransitionTimers.get(index));
              colorTransitionTimers.delete(index);
            }
            completedChars.delete(index);
            gsap.set(char, { color: colorInitial });
            return;
          }

          if (completedChars.has(index)) return;

          if (index <= currentCharIndex) {
            gsap.set(char, { color: colorAccent });
            if (!colorTransitionTimers.has(index)) {
              scheduleFinalTransition(char, index);
            }
          } else {
            gsap.set(char, { color: colorInitial });
          }
        });

        lastScrollProgress = progress;
      },
    });

    this.scrollTriggers.push(st);
  }

  destroy() {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];

    // Revert SplitText proprement
    this.splits.forEach((s) => {
      try {
        s.revert();
      } catch (e) {}
    });
    this.splits = [];
  }
}

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class ApparitionText {
  constructor() {
    this.elements = document.querySelectorAll("[data-appear]");
    this.containers = document.querySelectorAll("[data-appear-container]");

    this.scrollTriggers = [];
    this.splits = [];

    this.init();
  }

  init() {
    if (!this.elements.length && !this.containers.length) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    this.initEls();
    this.initContainers();

    ScrollTrigger.refresh();
  }

  initEls() {
    this.elements.forEach((el) => this.animate(el));
  }

  initContainers() {
    this.containers.forEach((container) => {
      Array.from(container.children).forEach((child) => this.animate(child));
    });
  }

  animate(el) {
    if (!el || el.dataset.appearInit === "true") return;
    el.dataset.appearInit = "true";

    const splitType = (el.dataset.appearSplit || "lines").toLowerCase();
    const useScroll = el.dataset.appearScroll !== "false";
    const start = el.dataset.appearStart || "top 80%";
    const duration = Number(el.dataset.appearDuration || 0.9);

    const defaultStagger =
      splitType === "chars" ? 0.012 : splitType === "words" ? 0.06 : 0.10;
    const stagger = Number(el.dataset.appearStagger || defaultStagger);

    const split = new SplitText(el, {
      type: splitType,
      linesClass: "appear-line",
      wordsClass: "appear-word",
      charsClass: "appear-char",
      mask:
        splitType === "chars" ? "chars" : splitType === "words" ? "words" : "lines",
    });

    this.splits.push(split);

    const targets =
      splitType === "chars" ? split.chars : splitType === "words" ? split.words : split.lines;

    if (!targets || !targets.length) return;

    const computedStyle = window.getComputedStyle(el);
    const textIndent = computedStyle.textIndent;
    if (textIndent && textIndent !== "0px" && split.lines && split.lines.length > 0) {
      split.lines[0].style.paddingLeft = textIndent;
      el.style.textIndent = "0";
    }

    gsap.set(targets, {
      yPercent: 115,
      opacity: 0,
      filter: "blur(6px)",
      willChange: "transform, opacity, filter",
    });

    const tl = gsap.timeline({ paused: true });

    tl.to(targets, {
      yPercent: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration,
      stagger,
      ease: "power4.out",
      clearProps: "willChange,filter",
    });

    tl.to(
      targets,
      {
        yPercent: 0,
        duration: 0.18,
        stagger: stagger * 0.6,
        ease: "power2.out",
      },
      "-=0.18"
    );

    if (useScroll) {
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => tl.play(),
      });
      this.scrollTriggers.push(st);
    } else {
      tl.play();
    }
  }

  destroy() {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];

    this.splits.forEach((s) => {
      try {
        s.revert();
      } catch (e) {}
    });
    this.splits = [];
  }
}

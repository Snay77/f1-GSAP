import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default class TeamPresentation {
    constructor() {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        this.setupElements();
        this.createScroll();
    }

    setupElements() {
        this.section = document.querySelector(".team-presentation");
        this.container = document.querySelector(".container-team-presentation");
        this.cards = gsap.utils.toArray(".team-presentation-card");

        this.progress = document.querySelector(".team-progress");
        this.stepsWrap = document.querySelector(".team-progress-steps");
        this.fill = document.querySelector(".team-progress-fill");
        this.thumb = document.querySelector(".team-progress-thumb");
        this.btnPrev = document.querySelector(".team-progress-arrow--prev");
        this.btnNext = document.querySelector(".team-progress-arrow--next");
        this.stepEls = [];

        this.st = null;
    }

    createScroll() {
        if (!this.section || !this.container || this.cards.length < 2) return;

        this.buildProgress();

        const maxIndex = this.cards.length - 1;

        const tween = gsap.to(this.container, {
            x: () => -window.innerWidth * maxIndex,
            ease: "none",
            scrollTrigger: {
                trigger: this.section,
                start: "top top",
                end: () => `+=${window.innerHeight * maxIndex}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,

                snap: {
                    snapTo: (value) => {
                        const step = 1 / maxIndex;
                        return Math.round(value / step) * step;
                    },
                    duration: 0.35,
                    ease: "power2.out",
                },

                onUpdate: (st) => {
                    const idx = Math.round(st.progress * maxIndex);
                    this.updateProgressFromIndex(idx);
                    this.updateArrows();
                },
            },
        });

        this.st = tween.scrollTrigger;
        this.bindArrows();
        this.updateArrows();

        ScrollTrigger.refresh();
    }

    bindArrows() {
        if (this.btnPrev) {
            this.btnPrev.addEventListener("click", () => this.goRelative(-1));
        }
        if (this.btnNext) {
            this.btnNext.addEventListener("click", () => this.goRelative(1));
        }
    }

    getCurrentIndex() {
        if (!this.st) return 0;
        const max = this.cards.length - 1;
        return Math.round(this.st.progress * max);
    }

    goRelative(dir) {
        const max = this.cards.length - 1;
        const current = this.getCurrentIndex();
        const next = gsap.utils.clamp(0, max, current + dir);
        this.scrollToIndex(next);
    }

    updateArrows() {
        if (!this.st) return;
        const max = this.cards.length - 1;
        const current = this.getCurrentIndex();

        if (this.btnPrev) this.btnPrev.disabled = current <= 0;
        if (this.btnNext) this.btnNext.disabled = current >= max;
    }


    buildProgress() {
        if (!this.stepsWrap) return;

        this.stepsWrap.innerHTML = "";
        this.stepEls = [];

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const teamName = card.dataset.team || `TEAM ${i + 1}`;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "team-progress-step";
            btn.setAttribute("data-team", teamName); // ✅ ici

            btn.addEventListener("click", () => this.scrollToIndex(i));

            this.stepsWrap.appendChild(btn);
            this.stepEls.push(btn);
        }
    }

    scrollToIndex(i) {
        if (!this.st) return;

        const y = this.st.start + window.innerHeight * i;

        gsap.to(window, {
            scrollTo: y,
            duration: 0.8,
            ease: "power2.inOut",
            overwrite: "auto",
        });
    }


    updateProgressFromIndex(index) {
        const max = this.cards.length - 1;
        const progress = max > 0 ? index / max : 0;

        if (this.fill) gsap.to(this.fill, { width: `${progress * 100}%`, duration: 0.2, overwrite: true });
        if (this.thumb) gsap.to(this.thumb, { left: `${progress * 100}%`, duration: 0.2, overwrite: true });

        this.stepEls.forEach((el, i) => {
            el.classList.toggle("is-active", i === index);
            el.classList.toggle("is-past", i < index);
        });
    }
}

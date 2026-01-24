import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default class TeamPresentation {
    constructor() {
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

        this.setupElements();
        this.createScrollAnimations();
    }

    setupElements() {
        this.section = document.querySelector(".team-presentation");
        this.container = document.querySelector(".container-team-presentation");
        this.cards = gsap.utils.toArray(".team-presentation-card");

        // Progress UI
        this.progress = document.querySelector(".team-progress");
        this.stepsWrap = document.querySelector(".team-progress-steps");
        this.fill = document.querySelector(".team-progress-fill");
        this.thumb = document.querySelector(".team-progress-thumb");
        this.stepEls = [];


        this.index = 0;
        this.isAnimating = false;

        this.threshold = 320;
        this.acc = 0;

        this.st = null;
        this.observer = null;

        this.stepEls = [];


    }

    createScrollAnimations() {
        if (!this.section || !this.container || this.cards.length < 2) return;

        this.buildProgress();      // ✅ génère N steps
        this.updateProgress(true);     // ✅ init

        this.createPin();
        this.createObserver();

        window.addEventListener("resize", () => {
            // recalc x sur l’index courant
            gsap.set(this.container, { x: -window.innerWidth * this.index });
        });

        ScrollTrigger.refresh();
    }

    buildProgress() {
        if (!this.stepsWrap) return;

        this.stepsWrap.innerHTML = "";
        this.stepEls = [];

        for (let i = 0; i < this.cards.length; i++) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "team-progress-step";
            btn.setAttribute("data-index", i + 1);

            btn.addEventListener("click", () => {
                if (this.isAnimating) return;
                this.goTo(i, i > this.index ? "down" : "up");
            });

            this.stepsWrap.appendChild(btn);
            this.stepEls.push(btn);
        }
    }

    updateProgress(immediate = false) {
        const max = this.cards.length - 1;
        const progress = max > 0 ? (this.index / max) : 0;
        const duration = immediate ? 0 : 0.8;

        if (this.fill) {
            gsap.to(this.fill, {
                width: `${progress * 100}%`,
                duration,
                ease: "expo.out",
            });
        }

        if (this.thumb) {
            gsap.to(this.thumb, {
                left: `${progress * 100}%`,
                duration,
                ease: "expo.out",
            });
        }

        if (this.stepEls.length) {
            this.stepEls.forEach((el, i) => {
                el.classList.toggle("is-active", i === this.index);
                el.classList.toggle("is-past", i < this.index);
            });
        }
    }


    createPin() {
        this.st = ScrollTrigger.create({
            trigger: this.section,
            start: "top top",
            end: () => `+=${window.innerHeight * (this.cards.length - 1)}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // markers: true,
        });
    }

    createObserver() {
        this.observer = Observer.create({
            target: window,
            type: "wheel,touch,pointer",
            tolerance: 2,
            wheelSpeed: 1,
            preventDefault: true,
            onChange: (self) => this.onStepInput(self.deltaY),
        });

        this.observer.disable();

        ScrollTrigger.create({
            trigger: this.section,
            start: "top top",
            end: "bottom top",
            onEnter: () => this.observer.enable(),
            onEnterBack: () => this.observer.enable(),
            onLeave: () => this.observer.disable(),
            onLeaveBack: () => this.observer.disable(),
        });
    }

    onStepInput(deltaY) {
        if (this.isAnimating) return;

        this.acc += deltaY;

        if (this.acc > this.threshold) {
            this.acc = 0;
            this.goTo(this.index + 1, "down");
        } else if (this.acc < -this.threshold) {
            this.acc = 0;
            this.goTo(this.index - 1, "up");
        }
    }

    goTo(nextIndex, direction) {
        const max = this.cards.length - 1;

        if (nextIndex < 0) return this.release("up");
        if (nextIndex > max) return this.release("down");

        this.index = nextIndex;
        this.updateProgress();

        if (this.thumb) {
            gsap.fromTo(
                this.thumb,
                { height: 45, backgroundColor: "#e10600" },
                { height: 34, backgroundColor: "#fff", duration: 0.4 }
            );
        }

        this.isAnimating = true;

        this.updateProgress();

        gsap.to(this.container, {
            x: -window.innerWidth * this.index,
            duration: 0.7,
            ease: "power3.inOut",
            onComplete: () => {
                this.isAnimating = false;
            },
        });
    }

    release(direction) {
        if (!this.st) return;

        this.isAnimating = true;
        this.observer.disable();

        const target = direction === "down"
            ? this.st.end + 2
            : this.st.start - 2;

        gsap.to(window, {
            scrollTo: target,
            duration: 0.25,
            ease: "power1.out",
            onComplete: () => {
                this.isAnimating = false;
            },
        });
    }
}

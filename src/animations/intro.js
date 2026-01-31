import gsap from "gsap";

export default class Intro {
    constructor() {
        return this.init();
    }

    init() {
        this.setupElements();
        this.lockScroll();
        return this.createTimeline();
    }

    setupElements() {
        this.countup = document.querySelector(".preloader-f1 .countup");
        this.progressFill = document.querySelector(".preloader-f1 .progress .fill");
        this.preloaderItems = [...document.querySelectorAll(".preloader-full")].reverse();
        this.windowCutout = document.querySelector(".window-cutout");
        this.preloader = document.querySelector(".preloader-f1");
    }

    lockScroll() {
        window.scrollTo(0, 0);

        this._scrollY = window.scrollY || 0;

        document.body.classList.add("is-locked");
        document.body.style.top = `-${this._scrollY}px`;
    }

    unlockScroll() {
        document.body.classList.remove("is-locked");
        document.body.style.top = "";

        window.scrollTo(0, 0);
    }

    createTimeline() {
        const tl = gsap.timeline({
            onComplete: () => {
                this.unlockScroll();
            },
        });

        tl.set(this.progressFill, { scaleX: 0, transformOrigin: "left center" }, 0);
        tl.set(this.preloader, { autoAlpha: 1 }, 0);

        const counter = { value: 0 };

        tl.to(
            counter,
            {
                value: 100,
                duration: 3,
                ease: "none",
                onUpdate: () => {
                    const stepped = Math.floor(counter.value / 10) * 10;
                    if (this.countup) this.countup.textContent = stepped;
                },
            },
            0
        );

        tl.to(
            this.progressFill,
            {
                scaleX: 1,
                duration: 3,
                ease: "power1.inOut",
            },
            0
        );

        this.preloaderItems.forEach((item, i) => {
            tl.set(
                item,
                { display: "none" },
                i * 0.3
            );
        });

        tl.to(
            [".countup", ".progress"],
            { opacity: 0, duration: 0.4 },
            3
        );

        tl.to(
            this.windowCutout,
            {
                scale: 1.5,
                duration: 1,
                ease: "power1.inOut",
            },
            3
        );

        tl.to(
            this.preloader,
            { autoAlpha: 0, duration: 0.4 },
            4
        );

        return tl;
    }
}
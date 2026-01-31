import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class Hero {
    constructor() {
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger);

        this.setupElements();

        if (!this.containerAbout || !this.containerLeft || !this.containerRight) {
            return;
        }


        this.createScrollAnimations();

    }

    setupElements() {
        this.containerAbout = document.querySelector(".about-container");
        this.containerLeft = document.querySelector(".about-left");
        this.containerRight = document.querySelector(".about-right");

        this.aboutImg = document.querySelector(".about-image picture img");
    }

    createScrollAnimations() {

        this.createPinAnimation();
        this.createParallaxAnimation();

        if (this.aboutImg && !this.aboutImg.complete) {
            this.aboutImg.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
        }

        ScrollTrigger.refresh();

    }

    getPinDistance() {
        const rightHeight = this.containerRight.scrollHeight;
        const leftVisible = window.innerHeight * 0.9;
        const extra = Math.max(0, rightHeight - leftVisible);

        return extra + window.innerHeight * 0.1;
    }

    createPinAnimation() {
        ScrollTrigger.create({
            trigger: this.containerAbout,
            start: "top top",
            end: `+=${this.getPinDistance()}`,
            pin: this.containerLeft,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        });

    }
    createParallaxAnimation() {
        if (!this.aboutImg) return;

        gsap.fromTo(
            this.aboutImg,
            {
                yPercent: 0,
                scale: 1.8,
            },
            {
                yPercent: 20,
                scale: 1.5,
                ease: "none",
                scrollTrigger: {
                    trigger: this.containerAbout,
                    start: "top top",
                    end: () => `+=${this.getPinDistance()}`,
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            }
        );
    }

}
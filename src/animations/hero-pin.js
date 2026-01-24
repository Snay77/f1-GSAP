import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class Hero {
    constructor() {
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger);

        this.setupElements();

        this.createScrollAnimations();
    }

    setupElements() {
        this.container = document.querySelector(".hero-f1");
        this.grid = document.querySelector(".hero-grid");
    }

    createScrollAnimations() {

        this.createPinAnimation();

        this.createAnimation();
    }

    createPinAnimation() {
        ScrollTrigger.create({
            trigger: this.container,
            start: "top top",
            end: `+=${window.innerHeight * 2}px`,
            pin: true,
            pinSpacing: true,
        });

    }

    createAnimation() {

        gsap.fromTo(
            this.grid,
            {
                scale: 2.5
            },
            {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: this.grid,
                    start: "top top",
                    end: `+=${window.innerHeight * 2}px`,
                    scrub: true,
                    // markers: true,
                }
            })

    }

}
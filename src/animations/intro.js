import gsap from "gsap";

export default class Intro {
    constructor() {
        this.countup = document.querySelector(".preloader-f1 .countup");
        this.progressFill = document.querySelector(".preloader-f1 .progress .fill");

        this.preloaderItems = [...document.querySelectorAll(".preloader-full")].reverse();

        this.windowCutout = document.querySelector(".window-cutout");

        this._initCountup();
        this._progressFill();
        this._hideTeamsSequentially();
        this._windowCutout();
    }

    _initCountup() {
        let counter = { value: 0 }

        const tl = gsap.timeline({
            defaults: {
                duration: 3,
                value: 100,
                ease: "none",
            },
        })

        tl.to(counter, {

            onUpdate: () => {
                const stepped = Math.floor(counter.value / 10) * 10;
                this.countup.textContent = stepped;
            },
            onComplete: () => {
                this._hide();
            },
        });
    }

    _progressFill() {
        const proxy = { value: 0 };
        
        const tl = gsap.timeline({
            defaults: {
                duration: 3,
                ease: "power1.inOut"
            },
            onComplete: () => {
                this._hide();
            },
        })

        tl.set(this.progressFill, {
            scaleX: 0,
            transformOrigin: "left center"
        })

        tl.to(this.progressFill, {
            scaleX: 1
        })
    }

    _hide() {
        const tl = gsap.timeline({
            defaults: {
                duration: 0.4
            },
        });

        tl.to([".countup", ".progress"], {
            opacity: 0,
        })
    }

    _hideTeamsSequentially() {
        const tl = gsap.timeline();

        this.preloaderItems.forEach((item) => {
            tl.to(item, {
                duration: 0,
                display: "none",
            }, "+=0.3");
        });
    }

    _windowCutout() {
        const tl = gsap.timeline();
        tl.to(this.windowCutout, {
            scale: 1.5,
            duration: 1,
            ease: "power1.inOut"
        }, "+=3"
    )
    }


}
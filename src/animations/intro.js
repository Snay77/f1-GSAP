import gsap from "gsap";

export default class Intro {
  constructor() {
    return this.init();
}

init() {
    this.setupElements();
    return this.createTimeline();
  }
  
  setupElements() {
      this.countup = document.querySelector(".preloader-f1 .countup");
    this.progressFill = document.querySelector(".preloader-f1 .progress .fill");
    this.preloaderItems = [...document.querySelectorAll(".preloader-full")].reverse();
    this.windowCutout = document.querySelector(".window-cutout");
    this.preloader = document.querySelector(".preloader-f1");
}

createTimeline() {
    const tl = gsap.timeline();
    
    // Préparation
    tl.set(this.progressFill, { scaleX: 0, transformOrigin: "left center" }, 0);
    tl.set(this.preloader, { autoAlpha: 1 }, 0);
    
    /* countup */
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

    /* progress fill de la barre*/
    tl.to(
      this.progressFill,
      {
          scaleX: 1,
          duration: 3,
          ease: "power1.inOut",
        },
        0
    );
    
    /* hide teams */
    this.preloaderItems.forEach((item, i) => {
        tl.set(
        item,
        { display: "none" },
        i * 0.3
    );
    });

    /* fade count + progress */
    tl.to(
        [".countup", ".progress"],
        { opacity: 0, duration: 0.4 },
        3
    );

    /* window cut */
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

// Sans barbaJS

// import gsap from "gsap";

// export default class Intro {
//     constructor() {
//         this.init();
//     }

//     init() {
//         this.setupElements();

//         this._initCountup();
//         this._progressFill();
//         this._hideTeamsSequentially();
//         this._windowCutout();
//     }

//     setupElements() {
//         this.countup = document.querySelector(".preloader-f1 .countup");
//         this.progressFill = document.querySelector(".preloader-f1 .progress .fill");

//         this.preloaderItems = [...document.querySelectorAll(".preloader-full")].reverse();

//         this.windowCutout = document.querySelector(".window-cutout");
//     }

//     _initCountup() {
//         let counter = { value: 0 }

//         const tl = gsap.timeline({
//             defaults: {
//                 duration: 3,
//                 value: 100,
//                 ease: "none",
//             },
//         })

//         tl.to(counter, {

//             onUpdate: () => {
//                 const stepped = Math.floor(counter.value / 10) * 10;
//                 this.countup.textContent = stepped;
//             },
//             onComplete: () => {
//                 this._hide();
//             },
//         });
//     }

//     _progressFill() {
//         const proxy = { value: 0 };

//         const tl = gsap.timeline({
//             defaults: {
//                 duration: 3,
//                 ease: "power1.inOut"
//             },
//             onComplete: () => {
//                 this._hide();
//             },
//         })

//         tl.set(this.progressFill, {
//             scaleX: 0,
//             transformOrigin: "left center"
//         })

//         tl.to(this.progressFill, {
//             scaleX: 1
//         })
//     }

//     _hide() {
//         const tl = gsap.timeline({
//             defaults: {
//                 duration: 0.4
//             },
//         });

//         tl.to([".countup", ".progress"], {
//             opacity: 0,
//         })
//     }

//     _hideTeamsSequentially() {
//         const tl = gsap.timeline();

//         this.preloaderItems.forEach((item) => {
//             tl.to(item, {
//                 duration: 0,
//                 display: "none",
//             }, "+=0.3");
//         });
//     }

//     _windowCutout() {
//         const tl = gsap.timeline();
//         tl.to(this.windowCutout, {
//             scale: 1.5,
//             duration: 1,
//             ease: "power1.inOut"
//         }, "+=3"
//         )
//     }

// }
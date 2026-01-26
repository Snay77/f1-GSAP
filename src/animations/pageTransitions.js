import { gsap } from "gsap";
import barba from "@barba/core";
import Intro from "./intro";

export default class Transitions {
    constructor() {
        this.init();
    }

    init() {
        this.setupElements();
        this.createTransitions();
    }

    // ✅ Table de clips (final + 0 top + 0 bottom)
    getClips() {
        return {
            // LEFT (0 en haut)
            ".transi-white-1": {
                final: "polygon(0% 0%, 40% 0%, 0% 70%)",
                zeroTop: "polygon(0% 0%, 40% 0%, 0% 0%)",
            },
            ".transi-red-dark-1": {
                final: "polygon(0% 90%, 0% 75%, 43% 0%, 51% 0%)",
                // on écrase les points bas vers 0 (ça garde l'angle)
                zeroTop: "polygon(51% 0%, 43% 0%, 43% 0%, 51% 0%)",
            },
            ".transi-red-light-1": {
                final: "polygon(0% 100%, 0% 95%, 54% 0%, 62% 0%, 5% 100%)",
                zeroTop: "polygon(58% 0%, 54% 0%, 54% 0%, 62% 0%, 62% 0%)",
            },

            // RIGHT (0 en bas)
            ".transi-red-light-2": {
                final: "polygon(38% 100%, 95% 0%, 100% 0%, 100% 5%, 46% 100%)",
                zeroBottom: "polygon(38% 100%, 38% 100%, 38% 100%, 46% 100%, 46% 100%)",
            },
            ".transi-red-dark-2": {
                final: "polygon(57% 100%, 100% 25%, 100% 10%, 49% 100%)",
                zeroBottom: "polygon(57% 100%, 57% 100%, 49% 100%, 49% 100%)",
            },
            ".transi-white-2": {
                final: "polygon(60% 100%, 100% 30%, 100% 100%)",
                zeroBottom: "polygon(60% 100%, 100% 100%, 100% 100%)",
            },
        };
    }

    setupElements() {
        const clips = this.getClips();

        // Overlay invisible au départ
        gsap.set(".transition", { autoAlpha: 0 });

        // Logo caché
        gsap.set(".transi-f1-logo", { autoAlpha: 0, scale: 0.85 });

        // Background prêt pour blur (⚠️ pas de WebkitBackdropFilter en tween)
        gsap.set(".transi-background", {
            autoAlpha: 0,
            backdropFilter: "blur(0px)",
        });

        // ✅ Applique les clips "0" personnalisés
        Object.entries(clips).forEach(([selector, def]) => {
            if (def.zeroTop) gsap.set(selector, { clipPath: def.zeroTop });
            if (def.zeroBottom) gsap.set(selector, { clipPath: def.zeroBottom });
        });
    }

    leaveAnimation(data) {
        const clips = this.getClips();
        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

        // On rend l’overlay visible
        tl.set(".transition", { autoAlpha: 1 });

        // 2s avant : blur background
        tl.set(".transi-background", { autoAlpha: 1 }, 0);
        tl.to(
            ".transi-background",
            {
                duration: 0.6,
                backdropFilter: "blur(12px)",
                autoAlpha: 1,
            },
            0
        );

        // 1s avant les bandes : logo pop
        tl.to(
            ".transi-f1-logo",
            {
                duration: 0.5,
                autoAlpha: 1,
                scale: 1,
                ease: "back.out(1.6)",
            },
            1
        );

        // À t=2 : bandes LEFT + RIGHT, stagger 0.3s
        tl.to(".transi-white-1", { duration: 0.6, clipPath: clips[".transi-white-1"].final }, 2)
            .to(".transi-red-dark-1", { duration: 0.6, clipPath: clips[".transi-red-dark-1"].final }, 2.3)
            .to(".transi-red-light-1", { duration: 0.6, clipPath: clips[".transi-red-light-1"].final }, 2.6);

        tl.to(".transi-white-2", { duration: 0.6, clipPath: clips[".transi-white-2"].final }, 2)
            .to(".transi-red-dark-2", { duration: 0.6, clipPath: clips[".transi-red-dark-2"].final }, 2.3)
            .to(".transi-red-light-2", { duration: 0.6, clipPath: clips[".transi-red-light-2"].final }, 2.6);

        // glow logo optionnel
        tl.to(
            ".transi-f1-logo img",
            { duration: 0.6, filter: "drop-shadow(0 0 30px rgba(225,6,0,0.35))" },
            2
        );

        return tl;
    }

    enterAnimation() {
        const clips = this.getClips();
        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

        // On arrive avec overlay visible + logo visible + background blur + bandes fermées
        tl.set(".transition", { autoAlpha: 1 });
        tl.set(".transi-background", { autoAlpha: 1, backdropFilter: "blur(12px)" });
        tl.set(".transi-f1-logo", { autoAlpha: 1, scale: 1 });

        // ✅ Inverse : on repasse vers les clips "0" personnalisés (stagger 0.3s)
        tl.to(".transi-red-light-1", { duration: 0.6, clipPath: clips[".transi-red-light-1"].zeroTop }, 0)
            .to(".transi-red-dark-1", { duration: 0.6, clipPath: clips[".transi-red-dark-1"].zeroTop }, 0.3)
            .to(".transi-white-1", { duration: 0.6, clipPath: clips[".transi-white-1"].zeroTop }, 0.6);

        tl.to(".transi-red-light-2", { duration: 0.6, clipPath: clips[".transi-red-light-2"].zeroBottom }, 0)
            .to(".transi-red-dark-2", { duration: 0.6, clipPath: clips[".transi-red-dark-2"].zeroBottom }, 0.3)
            .to(".transi-white-2", { duration: 0.6, clipPath: clips[".transi-white-2"].zeroBottom }, 0.6);

        // Logo out
        tl.to(".transi-f1-logo", { duration: 0.35, autoAlpha: 0, scale: 0.92, ease: "power2.inOut" }, 0.9);

        // Enlève blur + cache overlay
        tl.to(".transi-background", { duration: 0.5, backdropFilter: "blur(0px)", autoAlpha: 0 }, 1.0);
        tl.to(".transition", { duration: 0.2, autoAlpha: 0 }, 1.2);

        return tl;
    }

    createTransitions() {
        barba.init({
            transitions: [
                {
                    name: "f1-page-transition",
                    once: () => {
                        gsap.set(".preloader-f1", { display: "block" });

                        const intro =  new Intro();

                        intro.eventCallback("onComplete", () => {
                            gsap.set(".preloader-f1", { display: "none" });
                        });

                        return intro;
                    },
                    leave: (data) => this.leaveAnimation(data),
                    enter: () => this.enterAnimation(),
                },
            ],
        });
    }
}

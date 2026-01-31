import gsap from "gsap";

console.log("[CircuitsHover] file loaded ✅");

export default class CircuitsHover {
    constructor() {
        console.log("[CircuitsHover] file loaded ✅");
        this.init();
    }

    init() {
        console.log("[CircuitsHover] init ✅");

        this.setupElements();

        console.log("[CircuitsHover] elements:", {
            table: !!this.table,
            rows: this.rows?.length,
            preview: !!this.preview,
            previewImg: !!this.previewImg,
        });
        if (!this.table || !this.rows.length || !this.preview || !this.previewImg) return;

        this.preloadImages();
        this.setupFollowMouse();
        this.bindEvents();
        this.setInitialState();
    }

    setupElements() {
        this.table = document.querySelector("[data-circuits-table]");
        this.rows = Array.from(document.querySelectorAll("[data-circuit-row]"));

        this.preview = document.querySelector("[data-circuit-preview]");
        this.previewImg = document.querySelector("[data-circuit-preview-img]");

        this.offsetX = 24;
        this.offsetY = 24;

        this.isActive = false;
        this.currentSrc = "";
    }

    preloadImages() {
        const urls = [...new Set(this.rows.map((r) => r.dataset.image).filter(Boolean))];

        urls.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }

    setupFollowMouse() {
        this.xTo = gsap.quickTo(this.preview, "x", { duration: 0.22, ease: "power3.out" });
        this.yTo = gsap.quickTo(this.preview, "y", { duration: 0.22, ease: "power3.out" });

        this.handleMove = (e) => {
            this.xTo(e.clientX + this.offsetX);
            this.yTo(e.clientY + this.offsetY);
        };
    }

    bindEvents() {
        this.handleLeaveTable = () => this.hide();

        this.handleEnterRow = (e) => {
            const row = e.currentTarget;
            this.setImage(row.dataset.image, row.dataset.alt);
            this.show();
        };

        this.handleClickRow = (e) => e.preventDefault();

        window.addEventListener("mousemove", this.handleMove);
        this.table.addEventListener("mouseleave", this.handleLeaveTable);

        this.rows.forEach((row) => {
            row.addEventListener("mouseenter", this.handleEnterRow);
            row.addEventListener("click", this.handleClickRow);
        });
    }

    setInitialState() {
        gsap.set(this.preview, { x: -9999, y: -9999, opacity: 0, scale: 0.98 });
        gsap.set(this.previewImg, { opacity: 1 });
    }

    show() {
        if (this.isActive) return;
        this.isActive = true;

        gsap.to(this.preview, {
            opacity: 1,
            scale: 1,
            duration: 0.18,
            ease: "power2.out",
        });
    }

    hide() {
        this.isActive = false;

        gsap.to(this.preview, {
            opacity: 0,
            scale: 0.985,
            duration: 0.18,
            ease: "power2.out",
        });
    }

    setImage(src, alt = "") {
        if (!src || src === this.currentSrc) return;
        this.currentSrc = src;

        gsap.to(this.previewImg, {
            opacity: 0,
            duration: 0.12,
            ease: "power1.out",
            onComplete: () => {
                this.previewImg.src = src;
                this.previewImg.alt = alt || "";
                gsap.to(this.previewImg, { opacity: 1, duration: 0.14, ease: "power1.out" });
            },
        });
    }

    destroy() {
        window.removeEventListener("mousemove", this.handleMove);
        if (this.table) this.table.removeEventListener("mouseleave", this.handleLeaveTable);

        this.rows.forEach((row) => {
            row.removeEventListener("mouseenter", this.handleEnterRow);
            row.removeEventListener("click", this.handleClickRow);
        });

        this.hide();
    }
}

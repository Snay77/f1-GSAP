import './style.scss';

import LenisScroll from "./animations/LenisScroll.js";
import Hero from './animations/hero-pin.js';
import About from './animations/about.js';
import TeamPresentation from './animations/teamPresentation.js';
import AboutAnimatedCopy from './animations/animatedText.js';
import Transitions from './animations/pageTransitions.js';
import CircuitsHover from './animations/circuitsHover.js';
import Cursor from './animations/cursor.js';
import ApparitionText from './animations/apparitionText.js';

class App {
    constructor() {
        this._initHero();
        this._initAbout();
        this._initTeamPresentation();
        this._initAboutAnimatedCopy();
        this._initTransitions();
        this._initCircuitsHover();
        this._initCursor();
        this._initApparitionText();
        this._initLenisScroll();
    }

    _initCursor() {
        this.cursor = new Cursor();
    }

    _initHero() {
        this.hero = new Hero();
    }

    _initAbout() {
        this.about = new About();
    }

    _initTeamPresentation() {
        this.teamPresentation = new TeamPresentation();
    }

    _initAboutAnimatedCopy() {
        this.aboutAnimatedCopy = new AboutAnimatedCopy();
    }

    _initTransitions() {
        this.transitions = new Transitions();
    }

    _initCircuitsHover() {
        console.log("[main] before new ✅");
        this.circuitsHover = new CircuitsHover();
        console.log("[main] after new ✅");
    }

    _initApparitionText() {
        this.apparitionText = new ApparitionText();
    }

    _initLenisScroll() {
        this.lenisScroll = new LenisScroll();
    }
}

new App();
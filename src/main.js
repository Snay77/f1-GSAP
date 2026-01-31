import './style.scss';

// import Intro from "./animations/intro.js"
import Hero from './animations/hero-pin.js';
import About from './animations/about.js';
import TeamPresentation from './animations/teamPresentation.js';
import AboutAnimatedCopy from './animations/animatedText.js';
import Transitions from './animations/pageTransitions.js';
import CircuitsHover from './animations/circuitsHover.js';
import Cursor from './animations/cursor.js';

class App {
    constructor() {
        // this._initIntro();
        this._initHero();
        this._initAbout();
        this._initTeamPresentation();
        this._initAboutAnimatedCopy();
        this._initTransitions();
        this._initCircuitsHover();
        this._initCursor();
    }

    _initCursor() {
        this.cursor = new Cursor();
    }

    // _initIntro() {
    //     this.intro = new Intro();
    // }

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
}

new App();